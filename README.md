# run-content


Node Express app with Playwright/Chromium. 
Images/fonts/CSS are blocked.

start with node .
go to localhost:8080/content?url=https://.....

all images, links, headings, forms and landmark elements are scraped, including details.

===

local testing:
docker build -t janwillemwilmsen/runcontent:latest .
docker run -p 3000:8080 janwillemwilmsen/runcontent:latest
-> Not pushed to dockerhub....

gcloud run deploy --source .

 [21] europe-west4 eemshaven