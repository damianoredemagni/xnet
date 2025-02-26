Idea:
- A Netflix-like platform, but the content is a collection of curated embedded X.com videos

Public Features:
- Home: a sleek UI, like Netflix (top banner/carousel, category rows promotional banners, etc.)
- Details screen: the individual screen for the selected video, navigated to when selecting from the home.

Admin Features:
- Dashboard: a CRUD page where admin can create new videos, add video categories, determine in which section of the home they will appear. manage/edit/delete existing videos.

Stack:
- HTML/CSS/JS
- we can start with Tailwind via CDN to get this started
- Database: JSON file on server side to keep things very simple, the admin will basically CRUD this file

Final Notes:
- This in itself will be made open source, it has to be really clean and tight and lightweight
- More features like search, discovery algorithm, and native adblock, will be implemented later.

Example X.com post embed code:
<blockquote class="twitter-tweet" data-media-max-width="560"><p lang="en" dir="ltr">Can you prompt this into existence? <a href="https://t.co/tVOzcL63qw">pic.twitter.com/tVOzcL63qw</a></p>&mdash; Brotzky (@brotzky_) <a href="https://twitter.com/brotzky_/status/1894428493993193533?ref_src=twsrc%5Etfw">February 25, 2025</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

- Note that we must strip this down (shown below)
- it's the actual url with the "status" that's needed
- we can remove ?ref_src=
- No text in between
- Retain widgets.js on the global level, not each entry

Basically this:
<blockquote class="twitter-tweet" data-media-max-width="560"><a href="https://twitter.com/brotzky_/status/1894428493993193533"></a></blockquote>
