# Smoke Test

|                 |                                                    |
| --------------- | -------------------------------------------------- |
| Deployment      | https://nikskr.github.io/trivia-quest/             |
| Branch / commit | `dev` / `f3e67bf77c7e006d23fb2f6c287ab71f70c6bb15` |
| Browser         | Chrome, Windows 10                                 |
| Date            | 2026-11-26                                         |
| Tested by       | nikskr                                             |

## Main flow

| #   | Step                                     | Expected result                                                                            | Status | Screenshot                                                                      |
| --- | ---------------------------------------- | ------------------------------------------------------------------------------------------ | ------ | ------------------------------------------------------------------------------- |
| 1   | Open the deployment                      | About Us page is styled, Play Now button is visible                                        | ✅     | [about](images/about.png)                                                       |
| 2   | Click Play Now                           | Settings: categories loaded, difficulty, number of questions 5–20                          | ✅     | [settings](images/settings.png)                                                 |
| 3   | Choose settings → Start                  | First question, progress, Score and Streak are shown                                       | ✅     | —                                                                               |
| 4   | Answer a question                        | Buttons are disabled, correct answer is highlighted in green, Next Question button appears | ✅     | [correct-answer-green](images/correct-answer-green.png)                         |
| 5   | Reach the last question                  | See Results button instead of Next Question                                                | ✅     | [last-question-see-results-button](images/last-question-see-results-button.png) |
| 6   | Click See Results                        | XP, Accuracy, Correct Answers and Leaderboard are shown                                    | ✅     | [results](images/results.png)                                                   |
| 7   | Press browser Back on the results screen | "Ready for a challenge?" placeholder, the finished game does not reopen                    | ✅     | [back-after-results](images/back-after-results.png)                             |
| 8   | Click Play Again                         | Settings page, a new game can be started                                                   | ✅     | [settings-after-play-again-button](images/settings-after-play-again-button.png) |

## Errors and edge cases

| #   | Step                                                                    | Expected result                                                                 | Status     | Screenshot                                                                            |
| --- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------- |
| 9   | DevTools → Network request blocking: `api_category.php` → open Settings | "No connection. Check your internet and try again." + Retry button              | ✅         | [retry-button-with-block-request-url](images/retry-button-with-block-request-url.png) |
| 10  | Remove the block → click Retry                                          | Category list is loaded                                                         | ✅         | —                                                                                     |
| 11  | Start → Back right away → Start again within 5 s                        | "Too many requests. Wait 5 seconds and try again.", Start works again after 5 s | ✅         | [block-frequently-repeated-requests](images/block-frequently-repeated-requests.png)   |
| 12  | Open an unknown route `#/qwertyyuiasd`                                  | 404 page in the app style with a link back                                      | ✅ → fixed | [404 (before fix)](images/404.png)                                                    |     |
| 13  | Check the console on page load                                          | No errors                                                                       | ✅ → fixed | —                                                                                     |

## Issues found

| #   | Issue                                                               | Fix                                     |
| --- | ------------------------------------------------------------------- | --------------------------------------- |
| 1   | 404 page has no styles (step 12)                                    | Added style for 404 page                |
| 2   | 404 error for `favicon.ico` in the console (step 13)                | Icon added in `index.html`              |
| 3   | Entities `&aring;`, `&iacute;`, `&oslash;` were shown as plain text | Extended the entity map in `decodeHtml` |

## Clarified during testing (not bugs)

- Records are stored in localStorage (`trivia-records`) because they must persist between visits. The last game result is stored in sessionStorage (`trivia-quest-result`) because it only needs to survive a page reload on the results screen.
- When offline, the question loading error is shown without a Retry button: the Start button acts as retry. Retry exists only for category loading (step 9).
- The categories request is not rate-limited by the API and is cached, so the first game starts immediately. The rate limit is checked with two question requests in a row (step 11).
