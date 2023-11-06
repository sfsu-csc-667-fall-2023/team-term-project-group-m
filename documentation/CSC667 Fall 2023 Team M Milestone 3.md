CSC667 Fall 2023 Team M Milestone 3 API Design

<table>
  <tr>
   <td>Action
   </td>
   <td>Inputs/Data
   </td>
   <td>Pre Condition(s)
   </td>
   <td>Post Condition(s)
   </td>
   <td>API Endpoint
   </td>
  </tr>
  <tr>
   <td>User registers for an account
   </td>
   <td>
<ol>

<li>username

<li>email

<li>password
</li>
</ol>
   </td>
   <td>
   </td>
   <td>
<ol>

<li>User information stored in DB under ‘users’ table

<li>userId is automatically generated in DB via incrementation

<li>User is then taken to login page
</li>
</ol>
   </td>
   <td>POST /user/register {username, email, password}
   </td>
  </tr>
  <tr>
   <td>User logs in
   </td>
   <td>
<ol>

<li>email

<li>password
</li>
</ol>
   </td>
   <td>User information must already exist in DB (email, password)
   </td>
   <td>
<ol>

<li>req.session.user contains current user data

<li>User is redirected to the lobby to see games
</li>
</ol>
   </td>
   <td>POST /user/login {email, password}
   </td>
  </tr>
  <tr>
   <td>User searches for a game
   </td>
   <td>1. user_id
<p>
2. game_title
<p>
3. game_id
<p>
4. game_title
<p>
5. player_count
   </td>
   <td>User must be already logged in with its credentials 
   </td>
   <td>1 User search for already existing game (search a game_title)
<p>
2 After search result user can see the game list in the global lobby
<p>
3 When user join to the game, the user_id is added to the  game_id
<p>
4. Player is
<p>
redirected to the
<p>
game room (or
<p>
waiting room)
   </td>
   <td>POST /games/
<p>
search
<p>
{ game_title,
<p>
player_count, game_id }
<p>
(player_id is available
<p>
in the session)
   </td>
  </tr>
  <tr>
   <td>User creates a game
   </td>
   <td>1. user_id
<p>
2. game_title
<p>
3. player_count
<p>
4. game_id
   </td>
   <td>Only the registered user can create the game
   </td>
   <td>1. A new game is
<p>
created (creating
<p>
a game_id)
<p>
2. That game list in
<p>
the global lobby
<p>
is updated to
<p>
include the new
<p>
game
<p>
3. user_id is
<p>
added to
<p>
game_id
<p>
4. Player is
<p>
redirected to the
<p>
game room (or
<p>
waiting room)
   </td>
   <td>POST /games/
<p>
create
<p>
{ game_title,
<p>
player_count, game_id }
<p>
(user_id is available
<p>
in the session)
   </td>
  </tr>
  <tr>
   <td>User joins a game 
   </td>
   <td>1. username
<p>
2. user_id
<p>
3. game_id
<p>
4. hand 
<p>
5. card_id
   </td>
   <td>1. user_id is a player
<p>
within the game_id after
<p>
joining
<p>
2. hand is within card_id 
<p>
3. game_id for a specific game room 
   </td>
   <td>1. username and user_id updated when user joins a game_id
<p>
2. Once in game user is 
<p>
given out there hand with each card having a card_id
   </td>
   <td>POST /games/:id/join
<p>
{game_id}
<p>
(username and user_id
<p>
updated and comes with the user to game session)
   </td>
  </tr>
  <tr>
   <td>User plays a card 
   </td>
   <td>1. card_id
<p>
2. user_id
<p>
3. game_id
<p>
4. hand 
<p>
5. topcard
<p>
6. turnOrder
   </td>
   <td>1. user_id is a
<p>
player in game_id
<p>
2. turnOrder will see if its user_id’s turn
<p>
3. user_id has
<p>
card_id in their
<p>
hand
<p>
4. playing card_id is
<p>
a legal move
   </td>
   <td>1. user_id plays a card_id from their hand within the game_id when it is their turn
<p>
2. topCard updates the pile to the most recently played card_id.
<p>
3. turnOrder rotates to the next player's turn
   </td>
   <td>POST /games/:id/
<p>
play
<p>
{ card_id }
   </td>
  </tr>
</table>
