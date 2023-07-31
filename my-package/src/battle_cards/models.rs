use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Deserialize, Serialize)]
pub enum Change {
    Increase,
    Decrease,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub enum Stat {
    Accuracy,
    Damage,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub enum Card {
    Strike(Strike),
    Block(Block),
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub enum Target {
    Owner,
    Opponent,
}

#[derive(Debug, Deserialize, Clone, Serialize)]
pub struct Effect {
    pub action: Change,
    pub amount: f32,
    pub stat: Stat,
    pub target: Target,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct Strike {
    pub name: String,
    pub damage: f32,
    pub accuracy: f32,
    pub effect: Effect,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct Block {
    pub name: String,
    pub damage_reduction: f32,
    pub strike_to_cancel: String,
    pub effect: Effect,
}

// The data from JS
#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct BattleCard {
    pub name: String,
    pub skill: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct PlayerDamages {
    pub player_1: Vec<PlayerTurns>,
    pub player_2: Vec<PlayerTurns>,
}

#[derive(Debug, Deserialize, Serialize, Default, Clone)]
pub struct PlayerTurns {
    pub damage: f32,
    pub is_cancelled: bool,
}
