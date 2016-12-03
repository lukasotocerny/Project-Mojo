<h2>Project Mojo - Mobile phone dating app using Ionic framework</h2>
<h3>Introduction</h3>
<p>The key idea behind Mojo is connecting people not primarily based on their physical appereance. It is done in a clever way of asking questions.
Users write their own 3 questions that they want others to answer. Now in order to connect to another person, one firstly sees only
his first question. If he/she answers correctly, they pass onto second question, then third and then they see the profile picture.</p>
<p>Some may argue that this is a feature to be added to already existing sites, having a disadvantage of narrowing the connection chances
for a user even more. But the key concept of Mojo is asymmetry. One has to answer three questions correctly in order to request, the
second party only confirms/declines.</p>

<h3>Project Structure</h3>
<p>The main app's functionality is in `/js/controller.js`, where there are scripts defining the behaviour in each of the UI-Router states.
Mojo is written using the AngularJS framework, therefore HTML files in `/templates/` are binded through scopes. Ionic uses open-source
UI-Router library, which helps navigation in the app through states. The server database operation can be found in the folder `/server`, 
where are the `.php` scripts with SQL queries.</p>
