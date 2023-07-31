use rand::Rng;
use std::collections::HashMap;

use super::models::{BattleCard, Block, Card, Change, Effect, PlayerTurns, Stat, Strike, Target};

impl Strike {
    // If strike hits, return the damage dealt
    // Otherwise, return 0
    pub fn simulate_strike(&self) -> f32 {
        let rng: f32 = rand::thread_rng().gen_range(0.0..1.0);
        let accuracy = self.accuracy;

        if rng <= accuracy {
            return self.damage;
        }
        0.0
    }

    // Checks for increase or decrease
    pub fn apply_effects(&mut self, affected_stat: &Stat, multiplier: f32) {
        match affected_stat {
            Stat::Accuracy => self.accuracy *= multiplier,
            Stat::Damage => self.damage *= multiplier,
        }
    }
}

pub fn get_strike_cards() -> HashMap<String, Strike> {
    let mut strike_cards: HashMap<String, Strike> = HashMap::with_capacity(7);

    let leg_strike = Strike {
        accuracy: 0.9,
        damage: 5.0,
        effect: Effect {
            action: Change::Increase,
            amount: 0.5,
            stat: Stat::Accuracy,
            target: Target::Owner,
        },
        name: "Leg Strike".to_string(),
    };

    let temple_strike = Strike {
        accuracy: 0.75,
        damage: 10.0,
        effect: Effect {
            action: Change::Decrease,
            amount: 0.5,
            stat: Stat::Accuracy,
            target: Target::Opponent,
        },
        name: "Temple Strike".to_string(),
    };

    let shoulder_strike = Strike {
        accuracy: 0.8,
        damage: 10.0,
        effect: Effect {
            action: Change::Decrease,
            amount: 0.1,
            stat: Stat::Accuracy,
            target: Target::Opponent,
        },
        name: "Shoulder Strike".to_string(),
    };

    let shoulder_thrust = Strike {
        name: "Shoulder Thrust".to_string(),
        damage: 8.0,
        accuracy: 0.85,
        effect: Effect {
            action: Change::Decrease,
            amount: 0.1,
            stat: Stat::Accuracy,
            target: Target::Opponent,
        },
    };

    let eye_poke = Strike {
        name: "Eye Poke".to_string(),
        damage: 12.0,
        accuracy: 0.6,
        effect: Effect {
            action: Change::Increase,
            amount: 0.15,
            stat: Stat::Accuracy,
            target: Target::Opponent,
        },
    };

    let stomach_thrust = Strike {
        name: "Stomach Thrust".to_string(),
        damage: 10.0,
        accuracy: 0.85,
        effect: Effect {
            action: Change::Increase,
            amount: 0.5,
            stat: Stat::Damage,
            target: Target::Owner,
        },
    };

    let head_strike = Strike {
        name: "Head Strike".to_string(),
        damage: 18.0,
        accuracy: 0.5,
        effect: Effect {
            action: Change::Decrease,
            amount: 0.15,
            stat: Stat::Accuracy,
            target: Target::Opponent,
        },
    };

    strike_cards.insert("Leg Strike".to_string(), leg_strike);
    strike_cards.insert("Temple Strike".to_string(), temple_strike);
    strike_cards.insert("Shoulder Strike".to_string(), shoulder_strike);
    strike_cards.insert("Shoulder Thrust".to_string(), shoulder_thrust);
    strike_cards.insert("Eye Poke".to_string(), eye_poke);
    strike_cards.insert("Stomach Thrust".to_string(), stomach_thrust);
    strike_cards.insert("Head Strike".to_string(), head_strike);

    strike_cards
}

pub fn get_block_cards() -> HashMap<String, Block> {
    let mut block_cards = HashMap::with_capacity(7);

    let leg_strike_block = Block {
        damage_reduction: 0.1,
        effect: Effect {
            action: Change::Increase,
            amount: 0.1,
            stat: Stat::Accuracy,
            target: Target::Owner,
        },
        name: "Leg Strike Block".to_string(),
        strike_to_cancel: "Leg Strike".to_string(),
    };

    let temple_strike_block = Block {
        name: "Temple Strike Block".to_string(),
        damage_reduction: 0.15,
        strike_to_cancel: "Temple Strike".to_string(),
        effect: Effect {
            action: Change::Decrease,
            amount: 0.1,
            stat: Stat::Accuracy,
            target: Target::Opponent,
        },
    };

    let shoulder_strike_block = Block {
        name: "Shoulder Strike Block".to_string(),
        damage_reduction: 0.15,
        strike_to_cancel: "Shoulder Strike".to_string(),
        effect: Effect {
            action: Change::Decrease,
            amount: 0.1,
            stat: Stat::Accuracy,
            target: Target::Opponent,
        },
    };

    let shoulder_thrust_block = Block {
        name: "Shoulder Thrust Block".to_string(),
        damage_reduction: 0.15,
        strike_to_cancel: "Shoulder Thrust".to_string(),
        effect: Effect {
            action: Change::Decrease,
            amount: 0.1,
            stat: Stat::Accuracy,
            target: Target::Opponent,
        },
    };

    let eye_poke_block = Block {
        name: "Eye Poke Block".to_string(),
        damage_reduction: 0.15,
        strike_to_cancel: "Eye Poke".to_string(),
        effect: Effect {
            action: Change::Decrease,
            amount: 0.1,
            stat: Stat::Damage,
            target: Target::Opponent,
        },
    };

    let stomach_thrust_block = Block {
        name: "Stomach Thrust Block".to_string(),
        damage_reduction: 0.15,
        strike_to_cancel: "Stomach Thrust".to_string(),
        effect: Effect {
            action: Change::Increase,
            amount: 0.5,
            stat: Stat::Damage,
            target: Target::Owner,
        },
    };

    let head_strike_block = Block {
        name: "Head Strike Block".to_string(),
        damage_reduction: 0.15,
        strike_to_cancel: "Head Strike".to_string(),
        effect: Effect {
            action: Change::Decrease,
            amount: 0.2,
            stat: Stat::Damage,
            target: Target::Opponent,
        },
    };

    block_cards.insert("Leg Strike Block".to_string(), leg_strike_block);
    block_cards.insert("Temple Strike Block".to_string(), temple_strike_block);
    block_cards.insert("Shoulder Strike Block".to_string(), shoulder_strike_block);
    block_cards.insert("Shoulder Thrust Block".to_string(), shoulder_thrust_block);
    block_cards.insert("Eye Poke Block".to_string(), eye_poke_block);
    block_cards.insert("Stomach Thrust Block".to_string(), stomach_thrust_block);
    block_cards.insert("Head Strike Block".to_string(), head_strike_block);

    block_cards
}

fn get_battle_cards(cards_data: &Vec<BattleCard>, battle_cards: &mut Vec<Card>) {
    let strike_cards = get_strike_cards();
    let block_cards = get_block_cards();

    for card in cards_data.iter() {
        let card_skill = card.skill.as_str();

        match card_skill {
            "strike" => {
                let strike_card = strike_cards
                    .get(&card.name)
                    .expect("Block card doesn't exist")
                    .clone();

                battle_cards.push(Card::Strike(strike_card));
            }
            "block" => {
                let block_card = block_cards
                    .get(&card.name)
                    .expect("Block card doesn't exist")
                    .clone();

                battle_cards.push(Card::Block(block_card));
            }
            _ => panic!("Invalid card type"),
        }
    }
}

const NUMBER_OF_CARDS: usize = 6;

pub fn player_turn(
    owner_cards: &Vec<BattleCard>,
    opponent_cards: &Vec<BattleCard>,
    owner_turns: &mut Vec<PlayerTurns>,
    opponent_turns: &mut Vec<PlayerTurns>,
) {
    // I need a copy since I fight against the borrow checker on borrowing mutables more than once
    // Fix if possible
    let mut owner_battle_cards: Vec<Card> = Vec::with_capacity(NUMBER_OF_CARDS);
    // let mut owner_battle_cards_copy: Vec<Card> = Vec::with_capacity(owner_cards.len());
    let mut opponent_battle_cards: Vec<Card> = Vec::with_capacity(NUMBER_OF_CARDS);
    // let mut opponent_battle_cards_copy: Vec<Card> = Vec::with_capacity(opponent_cards.len());

    get_battle_cards(owner_cards, &mut owner_battle_cards);
    // get_battle_cards(owner_cards, &mut owner_battle_cards_copy);
    get_battle_cards(opponent_cards, &mut opponent_battle_cards);
    // get_battle_cards(opponent_cards, &mut opponent_battle_cards_copy);

    for (i, card) in owner_battle_cards.iter_mut().enumerate() {
        match card {
            Card::Strike(strike) => {
                let damage = strike.simulate_strike();

                if damage > 0.0 && i > 0 {
                    match strike.effect.target {
                        Target::Opponent => {
                            // let mut owner_prev_card = &owner_battle_cards[i - 1];

                            let mut opponent_next_card = &mut opponent_battle_cards[i + 1];

                            apply_strike_effects(strike, &mut opponent_next_card);
                        }
                        Target::Owner => {
                            // Instead of mutating the next card, an idea is to just store the effects in some variable and apply it?

                            // let mut owner_next_card = &mut owner_battle_cards[i + 1];

                            // apply_strike_effects(strike, &mut owner_next_card);
                        }
                    }
                }

                owner_turns[i].damage = damage;
            }
            Card::Block(block) => {
                let opponent_card = &opponent_battle_cards[i];

                match opponent_card {
                    Card::Strike(strike) => {
                        let is_cancelled = block.strike_to_cancel == strike.name;

                        if is_cancelled {
                            opponent_turns[i].is_cancelled = true;
                        }
                    }
                    Card::Block(_) => (),
                }
            }
        }
    }
}

// The stats that can change are accuracy and damage, both stats are only present on strike cards
fn apply_strike_effects(strike: &Strike, strike_card_to_affect: &mut Card) {
    let affected_stat = &strike.effect.stat;
    let action = &strike.effect.action;
    let amount = &strike.effect.amount;

    let multiplier = match action {
        Change::Decrease => 1.0 - amount,
        Change::Increase => 1.0 + amount,
    };

    // If the strike card doesn't exist / if it wasn't a strike, do nothing
    match strike_card_to_affect {
        Card::Strike(strike) => {
            strike.apply_effects(affected_stat, multiplier);
        }
        Card::Block(_) => (),
    }
}
