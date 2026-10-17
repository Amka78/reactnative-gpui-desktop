use napi::bindgen_prelude::*;
use napi_derive::napi;
use serde::{Deserialize, Serialize};
use gpui::{div, prelude::*, rgb, px};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct GpuINode {
    pub node_type: String,
    pub props: serde_json::Value,
    pub children: Vec<GpuINode>,
}

impl GpuINode {
    fn into_element(self) -> gpui::Div {
        let mut el = div();

        if let Some(style) = self.props.get("style").and_then(|v| v.as_object()) {
            if let Some(bg) = style.get("backgroundColor").and_then(|v| v.as_str()) {
                if let Some(color) = parse_hex_color(bg) {
                    el = el.bg(color);
                }
            }
            if let Some(padding) = style.get("padding").and_then(|v| v.as_f64()) {
                el = el.p(px(padding as f32));
            }
        }

        if let Some(content) = self.props.get("content").and_then(|v| v.as_str()) {
            el = el.child(
                div().child(content.to_string())
            );
        }

        for child in self.children {
            el = el.child(child.into_element());
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
}

impl gpui::Render for TreeView {
    fn render(&mut self, _window: &mut gpui::Window, _cx: &mut gpui::Context<Self>) -> impl gpui::IntoElement {
        self.root.clone().into_element()
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
pub fn open_window(title: String, width: u32, height: u32, tree_json: String) -> Result<()> {
    let root: GpuINode = serde_json::from_str(&tree_json)
        .map_err(|e| Error::from_reason(format!("Failed to parse tree: {}", e)))?;

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
                _cx.new(|_| TreeView { root })
            },
        )
        .unwrap();
        cx.activate(true);
    });

    Ok(())
}
