import { db } from '$lib/firebase/firebase';
import type {
  BattleCard,
  BattleCardResults,
  BattleCardTurn,
  BattleCardTurns,
  UserData
} from '$lib/types';
import { collection, getDocs } from 'firebase/firestore';
import { card_battle } from '$lib/pkg/my_package';

export async function battle(player1: UserData, player2: UserData): Promise<BattleCardResults[]> {
  const [player1Cards, player2Cards] = await Promise.all([
    getPlayerCards(player1.auth_data.uid),
    getPlayerCards(player2.auth_data.uid)
  ]);

  const player1CardsStr = JSON.stringify(player1Cards);
  const player2CardsStr = JSON.stringify(player2Cards);

  let player1TotalDamage: number | null = player1Cards.length > 0 ? 0 : null;
  let player2TotalDamage: number | null = player2Cards.length > 0 ? 0 : null;
  let player1Turns: BattleCardTurn[] = [];
  let player2Turns: BattleCardTurn[] = [];

  if (player1TotalDamage !== null && player2TotalDamage !== null) {
    const battleResults: BattleCardTurns = card_battle(player1CardsStr, player2CardsStr);

    player1Turns = battleResults.player_1;
    player2Turns = battleResults.player_2;

    battleResults.player_1.forEach((result) => {
      if (!result.is_cancelled) {
        player1TotalDamage! += Math.round(result.damage * 100) / 100;
      }
    });

    battleResults.player_2.forEach((result) => {
      if (!result.is_cancelled) {
        player2TotalDamage! += Math.round(result.damage * 100) / 100;
      }
    });
  }

  let results: BattleCardResults[] = [
    {
      totalDamage: player1TotalDamage,
      uid: player1.auth_data.uid,
      turns: player1Turns,
      battle_cards: player1Cards || []
    },
    {
      totalDamage: player2TotalDamage,
      uid: player2.auth_data.uid,
      turns: player2Turns,
      battle_cards: player2Cards || []
    }
  ];

  return results;
}

async function getPlayerCards(uid: string): Promise<BattleCard[]> {
  const cardCollection = collection(db, `users/${uid}/battle_cards`);

  try {
    const getCards = await getDocs(cardCollection);
    const battleCards = getCards.docs
      .filter((card) => card.id.startsWith('card'))
      .map((card) => card.data() as BattleCard);

    return battleCards;
  } catch (err) {
    throw new Error('Error getting player cards: ' + err);
  }
}
