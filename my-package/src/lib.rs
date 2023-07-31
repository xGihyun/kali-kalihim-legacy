use battle_cards::battle_card::player_turn;
use image::imageops::FilterType::Lanczos3;
use image::{DynamicImage, ImageOutputFormat};
use std::io::Cursor;
use wasm_bindgen::prelude::*;
// use webp::Encoder;
use gloo_utils::format::JsValueSerdeExt;

mod battle_cards;

// use battle_cards::battle_card::simulate_strike;
use battle_cards::models::{BattleCard, PlayerDamages, PlayerTurns};

#[wasm_bindgen]
pub fn card_battle(
    player_1_cards_str: String,
    player_2_cards_str: String,
) -> Result<JsValue, JsValue> {
    let player_1_cards_json = format!(r#"{player_1_cards_str}"#);
    let player_2_cards_json = format!(r#"{player_2_cards_str}"#);

    let player_1_cards: Vec<BattleCard> =
        serde_json::from_str(&player_1_cards_json).expect("Failed to parse Player 1 cards");
    let player_2_cards: Vec<BattleCard> =
        serde_json::from_str(&player_2_cards_json).expect("Failed to parse Player 2 cards");

    // let mut player_1_damage = 0;
    // let mut player_2_damage = 0;

    let mut player_1_turns: Vec<PlayerTurns> = vec![PlayerTurns::default(); 6];
    let mut player_2_turns: Vec<PlayerTurns> = vec![PlayerTurns::default(); 6];

    // Iterate over each players' cards and determine which cards dealt damage and which cards were cancelled
    player_turn(
        &player_1_cards,
        &player_2_cards,
        &mut player_1_turns,
        &mut player_2_turns,
    );
    player_turn(
        &player_2_cards,
        &player_1_cards,
        &mut player_2_turns,
        &mut player_1_turns,
    );

    // Iterate over the player turns and apply the effects of the cards and add/deduct stats fr

    // Change variable names later
    // It works!
    // Remember to return only the total damage dealt by each player later
    let test = PlayerDamages {
        player_1: player_1_turns,
        player_2: player_2_turns,
    };

    let test2 = JsValue::from_serde(&test).expect("Failed to serialize");

    Ok(test2)
}

#[wasm_bindgen]
pub fn crop(bytes: &[u8], width: u32, height: u32) -> Result<Vec<u8>, JsValue> {
    let mut image = image::load_from_memory(bytes)
        .map_err(|e| JsValue::from_str(&format!("Failed to load the image: {}", e)))?;
    let cropped_image = crop_image(&mut image, width, height)
        .map_err(|e| JsValue::from_str(&format!("Failed to crop the image: {}", e)))?;

    let mut cropped_buffer = Vec::new();
    let format = ImageOutputFormat::Jpeg(100);
    let resized_cropped_image = cropped_image.resize(width, height, Lanczos3);

    // let webp_image = image_to_webp(bytes, width, height);

    resized_cropped_image
        .write_to(&mut Cursor::new(&mut cropped_buffer), format)
        .map_err(|e| JsValue::from_str(&format!("Failed to write the image: {}", e)))?;

    Ok(cropped_buffer)
}

// fn image_to_webp(bytes: &[u8], width: u32, height: u32) -> Vec<u8> {
//     let encoded = Encoder::from_rgba(bytes, width, height).encode(100.0).to_vec();

//     encoded
// }

fn crop_image(
    image: &mut DynamicImage,
    target_width: u32,
    target_height: u32,
) -> Result<DynamicImage, Box<dyn std::error::Error>> {
    let image_width = image.width();
    let image_height = image.height();

    let aspect_ratio = target_width as f64 / target_height as f64;
    let image_aspect_ratio = image_width as f64 / image_height as f64;

    let (x, y, width, height) = if image_aspect_ratio > aspect_ratio {
        let new_width = (image_height as f64 * aspect_ratio) as u32;
        let x = (image_width - new_width) / 2;

        (x, 0, new_width, image_height)
    } else {
        let new_height = (image_width as f64 / aspect_ratio) as u32;
        let y = (image_height - new_height) / 2;

        (0, y, image_width, new_height)
    };

    let cropped_image = image.crop_imm(x, y, width, height);

    Ok(cropped_image)
}
