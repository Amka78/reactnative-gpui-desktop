use napi::bindgen_prelude::*;
use napi::threadsafe_function::{ThreadsafeFunction, ThreadSafeCallContext, ThreadsafeFunctionCallMode};
use napi_derive::napi;
use serde::{Deserialize, Serialize};
use gpui::{div, prelude::*, rgb, px};
use std::sync::Arc;
use std::collections::HashMap;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct GpuINode {
    pub node_type: String,
    pub props: serde_json::Value,
    pub children: Vec<GpuINode>,
}

impl GpuINode {
    fn into_element(self, event_handlers: Arc<HashMap<String, ThreadsafeFunction<String>>>) -> gpui::Div {
        let mut el = div();

        if let Some(style) = self.props.get("style").and_then(|v| v.as_object()) {
            if let Some(bg) = style.get("backgroundColor").and_then(|v| v.as_str()) {
                if let Some(color) = parse_hex_color(bg) {
                    el = el.bg(color);
                }
            }
            if let Some(color) = style.get("color").and_then(|v| v.as_str()) {
                if let Some(c) = parse_hex_color(color) {
                    el = el.text_color(c);
                }
            }
            if let Some(padding) = style.get("padding").and_then(|v| v.as_f64()) {
                el = el.p(px(padding as f32));
            }
            if let Some(margin) = style.get("margin").and_then(|v| v.as_f64()) {
                el = el.m(px(margin as f32));
            }
            if let Some(w) = style.get("width").and_then(|v| v.as_f64()) {
                el = el.w(px(w as f32));
            }
            if let Some(h) = style.get("height").and_then(|v| v.as_f64()) {
                el = el.h(px(h as f32));
            }
            if let Some(r) = style.get("borderRadius").and_then(|v| v.as_f64()) {
                el = el.rounded(px(r as f32));
            }
            if let Some(bw) = style.get("borderWidth").and_then(|v| v.as_f64()) {
                el = el.border(px(bw as f32));
            }
            if let Some(bc) = style.get("borderColor").and_then(|v| v.as_str()) {
                if let Some(c) = parse_hex_color(bc) {
                    el = el.border_color(c);
                }
            }
            if let Some(fs) = style.get("fontSize").and_then(|v| v.as_f64()) {
                el = el.text_size(px(fs as f32));
            }
            if let Some(gap) = style.get("gap").and_then(|v| v.as_f64()) {
                el = el.gap(px(gap as f32));
            }
            if style.get("display").and_then(|v| v.as_str()) == Some("flex") {
                el = el.flex();
            }
            if let Some(dir) = style.get("flexDirection").and_then(|v| v.as_str()) {
                match dir {
                    "column" => el = el.flex_col(),
                    "row" => el = el.flex_row(),
                    _ => {}
                }
            }
        }

        // Event handling: onPress
        if let Some(event_id) = self.props.get("onPress").and_then(|v| v.as_str()) {
            let event_id = event_id.to_string();
            let handlers = event_handlers.clone();
            el = el.on_mouse_down(gpui::MouseButton::Left, move |_, _, _| {
                if let Some(handler) = handlers.get(&event_id) {
                    handler.call(
                        Ok(event_id.clone()),
                        ThreadsafeFunctionCallMode::NonBlocking,
                    );
                }
            });
        }

        if let Some(content) = self.props.get("content").and_then(|v| v.as_str()) {
            el = el.child(div().child(content.to_string()));
        }

        for child in self.children {
            el = el.child(child.into_element(event_handlers.clone()));
        }

        el
    }
}

fn parse_hex_color(hex: &str) -> Option<gpui::Rgba> {
    let hex = hex.trim_start_matches('#');
    if hex.len() != 6 { return None; }
    let r = u8::from_str_radix(&hex[0..2], 16).ok()?;
    let g = u8::from_str_radix(&hex[2..4], 16).ok()?;
    let b = u8::from_str_radix(&hex[4..6], 16).ok()?;
    Some(rgb(((r as u32) << 16) | ((g as u32) << 8) | (b as u32)))
}

struct TreeView {
    root: GpuINode,
    event_handlers: Arc<HashMap<String, ThreadsafeFunction<String>>>,
}

impl gpui::Render for TreeView {
    fn render(&mut self, _window: &mut gpui::Window, _cx: &mut gpui::Context<Self>) -> impl gpui::IntoElement {
        self.root.clone().into_element(self.event_handlers.clone())
    }
}

#[napi]
pub fn render_tree(tree_json: String) -> Result<String> {
    let node: GpuINode = serde_json::from_str(&tree_json)
        .map_err(|e| Error::from_reason(format!("Failed to parse tree: {}", e)))?;

    let rendered = serde_json::to_string_pretty(&node)
        .map_err(|e| Error::from_reason(format!("Failed to serialize: {}", e)))?;

    Ok(rendered)
}

#[napi]
pub fn open_window_with_events(
    title: String,
    width: u32,
    height: u32,
    tree_json: String,
    on_event: JsFunction,
) -> Result<()> {
    let root: GpuINode = serde_json::from_str(&tree_json)
        .map_err(|e| Error::from_reason(format!("Failed to parse tree: {}", e)))?;

    // Create a threadsafe function for event callbacks
    let tsfn: ThreadsafeFunction<String> = on_event.create_threadsafe_function(
        0,
        |ctx: ThreadSafeCallContext<String>| Ok(vec![ctx.value]),
    )?;

    // Build event handlers map (for now, single handler for all events)
    let mut handlers = HashMap::new();
    handlers.insert("default".to_string(), tsfn);
    let event_handlers = Arc::new(handlers);

    use gpui::{App, Bounds, WindowBounds, WindowOptions, size};
    use gpui_platform::application;

    application().run(move |cx: &mut App| {
        let bounds = Bounds::centered(
            None,
            size(px(width as f32), px(height as f32)),
            cx,
        );
        cx.open_window(
            WindowOptions {
                titlebar: Some(gpui::TitlebarOptions {
                    title: Some(title.clone().into()),
                    ..Default::default()
                }),
                window_bounds: Some(WindowBounds::Windowed(bounds)),
                ..Default::default()
            },
            |_, _cx| {
                _cx.new(|_| TreeView { root, event_handlers })
            },
        )
        .unwrap();
        cx.activate(true);
    });

    Ok(())
}
