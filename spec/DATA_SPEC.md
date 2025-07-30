# Data Specification

This document describes the data fields found in the roster CSV files.

## File: 2025_member_info_responses - Form Responses 1.csv

### Overview
This CSV file contains member information for the 2025 roster, including personal details, team roles, physical attributes, and personal preferences.

### Field Descriptions

| Field Name | Japanese Name | Description | Data Type | Example |
|------------|---------------|-------------|-----------|---------|
| Timestamp | - | Date and time when the form was submitted | DateTime | 7/28/2025 14:28:57 |
| 名前（漢字 or カタカナ） | Name (Kanji or Katakana) | Member's full name in Japanese characters | String | 馬渡健裕 |
| よみがな（ひらがな） | Reading (Hiragana) | Phonetic reading of the name in hiragana | String | まわたり　たけひろ |
| 名前アルファベット表記 | Name (Alphabet) | Member's name in Roman alphabet | String | MAwatari Tanekhiro |
| ポジション | Position | Playing position on the team | String | WR, DB, RB, OL, DL, LB, QB, Staff |
| 背番号 | Jersey Number | Player's jersey number | Integer | 24, 7, 2, etc. |
| 身長（cm） | Height (cm) | Player's height in centimeters | Decimal | 175, 170.4 |
| 体重（kg） | Weight (kg) | Player's weight in kilograms | Integer | 70, 75, 82 |
| 生年月日 | Date of Birth | Player's birth date | Date | 12/22/1999 |
| 次の背番号の人の紹介・ひとこと | Introduction of Next Number | Brief introduction or comment about another team member | String | 顔が非常に小さく、手足は長いです。 |
| チーム内での役割 | Team Role | Special role or responsibility within the team | String | 主将, いじられおにいさん, DLパートリーダー |
| 画像_01_真面目型 | Image 01 - Serious | URL to a serious/formal photo | URL | Google Drive link |
| 画像_02_自由型 | Image 02 - Casual | URL to a casual/fun photo | URL | Google Drive link |
| 勤務先（学生は所属組織・学部・学科or研究室） | Workplace/School | Current employer or academic affiliation | String | 三菱商事, 東京大学 |
| 出身校 | Alma Mater | School graduated from | String | 東京大学, 慶應義塾大学 |
| 今シーズンの意気込み | Season Aspirations | Goals or aspirations for the current season | String | リーディングレシーバー獲得！ |
| 俺の/私の ここを見てくれ/自信あります | My Strengths/Watch This | Personal strengths or skills to highlight | String | キャッチ, ベンチでキレ散らかしている様子。 |
| 休日の過ごし方、趣味 | Hobbies/Weekend Activities | How they spend free time and hobbies | String | パター, 家族サービス |
| 自分の最近の推し◯◯ | Recent Favorites | Recent interests or things they're into | String | B'z, コンビニスイーツ |
| ファンからされてうれしい差し入れ | Favorite Fan Gifts | Types of gifts they appreciate from fans | String | 話しかけてください！, 甘いもの！ |
| TRIAXの好きなところ | What I Like About TRIAX | What they appreciate about the team | String | TRIAXファミリー, 若い、チーム全員がチームのために考えて行動しているところ |

### Position Codes
- **WR**: Wide Receiver
- **DB**: Defensive Back
- **RB**: Running Back
- **OL**: Offensive Line
- **DL**: Defensive Line
- **LB**: Linebacker
- **QB**: Quarterback
- **Staff**: Non-playing team staff

### Data Notes
1. Staff members may have empty values for physical attributes (height, weight, jersey number)
2. Image URLs point to Google Drive hosted images
3. Some fields may contain multiple image URLs separated by commas
4. Dates are formatted as M/D/YYYY
5. Times are in 24-hour format
6. All text fields support Japanese characters