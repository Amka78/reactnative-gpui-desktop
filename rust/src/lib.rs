use napi::bindgen_prelude::*;
use napi_derive::napi;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct GpuINode {
    pub node_type: String,
    pub props: serde_json::Value,
    pub children: Vec<GpuINode>,
}

#[napi]
pub fn render_tree(tree_json: String) -> Result<String> {
    let node: GpuINode = serde_json::from_str(&tree_json)
        .map_err(|e| Error::from_reason(format!("Failed to parse tree: {}", e)))?;
    
    // TODO: GPUI-CE統合時はここで実際のレンダリングを行う
    // 現在はJSONをそのまま返す（モック）
    let rendered = serde_json::to_string_pretty(&node)
        .map_err(|e| Error::from_reason(format!("Failed to serialize: {}", e)))?;
    
    Ok(rendered)
}

#[napi]
pub fn create_window(title: String, width: u32, height: u32) -> Result<()> {
    // TODO: GPUI-CE統合時はここでウィンドウを作成
    println!("Creating window: {} ({}x{})", title, width, height);
    Ok(())
}
