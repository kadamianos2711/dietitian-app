export type DailyConditionType = 
    | 'sick'          // Άρρωστος / γριπωμένος
    | 'constipation'  // Δυσκοιλιότητα
    | 'ibs'           // Σπαστική κολίτιδα (IBS) σε έξαρση
    | 'gerd'          // Γαστρίτιδα / παλινδρόμηση
    | 'sore_throat'   // Πονόλαιμος / δυσκολία στην κατάποση
    | 'stress'        // Υψηλό στρες
    | 'bad_sleep'     // Κακός ύπνος
    | 'soft_food'     // Θέλω πιο μαλακά φαγητά
    | 'easy_food'     // Θέλω πιο εύκολα / γρήγορα γεύματα
    | 'cheap_food';   // Θέλω οικονομικά γεύματα

export type DailyEventTypeType = 
    | 'birthday'
    | 'night_out'
    | 'holiday'
    | 'trip'
    | 'cheat_meal';

export interface DailyEvent {
    type: DailyEventTypeType;
    note?: string;
}

export interface DailyContext {
    dayIndex: number; // 0-6
    conditions: DailyConditionType[];
    event?: DailyEvent;
}

export const CONDITION_LABELS: Record<DailyConditionType, string> = {
    'sick': 'Άρρωστος / γριπωμένος',
    'constipation': 'Δυσκοιλιότητα',
    'ibs': 'Σπαστική κολίτιδα (IBS) σε έξαρση',
    'gerd': 'Γαστρίτιδα / παλινδρόμηση',
    'sore_throat': 'Πονόλαιμος / δυσκολία στην κατάποση',
    'stress': 'Υψηλό στρες',
    'bad_sleep': 'Κακός ύπνος',
    'soft_food': 'Θέλω πιο μαλακά φαγητά',
    'easy_food': 'Θέλω πιο εύκολα / γρήγορα γεύματα',
    'cheap_food': 'Θέλω οικονομικά γεύματα'
};

export const EVENT_LABELS: Record<DailyEventTypeType, string> = {
    'birthday': 'Γενέθλια',
    'night_out': 'Έξοδος',
    'holiday': 'Γιορτή',
    'trip': 'Ταξίδι',
    'cheat_meal': 'Ελεύθερο γεύμα'
};
