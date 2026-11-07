/* Rules tab content: Basics, Situations, and Ringette Ontario extras.
   Every card is written from Ringette Canada's Official Rules & Case Book 2025–2027
   (rule numbers + printed page numbers) or Ringette Ontario's Competition Playing Rules (Aug 2025). */
(function () {
  const RO_PDF = 'https://cloud.rampinteractive.com/ringetteontariogames/files/Operating%20Resources/2025/Competition%20Playing%20Rules_2025-2026-FINAL.pdf';
  const R = (ref, title, page) => ({ ref, title, page });
  const RO = (ref, title) => ({ ref, title, ro: true });

  const CARDS = [
    // ---------------- BASICS ----------------
    { id: 'the-game', kind: 'basic', title: 'Ringette in 30 seconds',
      short: 'Five skaters and a goalie a side, a straight stick, a rubber ring, and no body contact.',
      body: [
        'Each team has at most six players on the ice: usually five skaters and a goaltender.',
        'Players use a straight stick and put it into the ring to carry, pass and shoot it.',
        'Body contact is a penalty. Players check the ring with their sticks, not the player.',
        'A goal counts when the whole ring crosses the goal line between the posts.',
        'There\'s no offside. Players can be anywhere, but the ring has to be passed over each blue line (see the next card).'
      ],
      rules: [R('8.3', 'Players on the ice', 32), R('11.1', 'Goal scoring', 89)], signals: ['goal', 'body-contact'] },

    { id: 'blue-lines', kind: 'basic', title: 'Passing over the blue lines',
      short: 'You can\'t skate the ring over a blue line, and you can\'t pass it over both blue lines at once.',
      body: [
        'The ring has to be passed, shot, deflected or batted to another player across each blue line. A player can\'t carry it over.',
        'What matters is where the ring is, not where the player or stick is.',
        'A pass can\'t go untouched from your own end all the way into the other end. That\'s a two blue line pass.',
        'If a player touches the ring after sending it over the blue line herself, her team can\'t play it for five seconds or until it leaves that zone.'
      ],
      rules: [R('8.4', 'Blue Line', 34), R('8.5', 'Two Blue Line Pass', 37)], signals: ['two-blue', 'line-violation', 'delayed-violation-five'] },

    { id: 'free-play-line', kind: 'basic', title: 'The free play line ("3 in")',
      short: 'Only three skaters per team are allowed past the free play line at each end.',
      body: [
        'The free play line is the thin red line across the top of the end-zone circles. The area behind it, out to the end boards, is the restricted area.',
        'Each team can have at most three skaters in each restricted area. Goalies don\'t count.',
        'Players can swap at the line: the one leaving has to have both skates on the line first.',
        'If the team with the ring has too many in there, play stops and it loses the ring. If the other team has an extra player who gets involved in the play, that\'s a delay of game penalty.'
      ],
      rules: [R('8.6', 'Free Play Line', 42)], signals: ['too-many-skaters', 'line-violation'], diagram: 'even' },

    { id: 'crease', kind: 'basic', title: 'The goal crease',
      short: 'Only the goalie may go in the crease, and only she can play a ring inside it.',
      body: [
        'The crease is the half-circle in front of the net. Only the goaltender (or a skater acting as goalie when the goalie is pulled) is allowed in it.',
        'No one else may touch the ring until it\'s completely outside the crease.',
        'If the team with the ring goes into the crease, play stops right away. If the other team does, it\'s a delayed violation.',
        'When the ring is in the crease, the goalie has five seconds to put it back into play outside the crease. She can throw it.'
      ],
      rules: [R('8.7', 'Goal Crease', 50), R('9.4', 'Goaltender with the ring', 59)], signals: ['line-violation', 'delayed-violation'] },

    { id: 'free-pass', kind: 'basic', title: 'Free passes: how play restarts',
      short: 'Play restarts with a free pass: one player, in one half of a circle, with five seconds to pass it out.',
      body: [
        'The ring sits in the half of the circle closer to the goal of the team getting the free pass.',
        'After the whistle, only the player taking the free pass may be in the circle. She has five seconds to send the ring completely out of the circle with her stick.',
        'She can\'t touch it again until another player does, and nobody else can touch it until it\'s out of the circle.',
        'If a teammate steps into the circle too early, play stops. If an opponent does, play stops only if her team then gets the ring in that zone within five seconds.'
      ],
      rules: [R('10.1', 'Free Pass', 71)], signals: ['five-second-count', 'five-second-expiry', 'all-clear', 'hold', 'direction-of-play'] },

    { id: 'goalie-ring', kind: 'basic', title: 'Goaltender rings',
      short: 'Most stoppages in a team\'s own end restart with the ring given to its goalie, not a free pass.',
      body: [
        'A free pass in a team\'s own end becomes a goaltender ring. The exceptions are stoppages for the ring leaving the rink, an injury, a penalty, a timeout, or a long delay.',
        'The goalie has five seconds to put the ring into play outside the crease, and can throw it.',
        'She can even throw it over her own blue line. But then her team can\'t take control of it in the middle zone for five seconds.',
        'Once she puts it out, she can\'t touch it again until someone else does.'
      ],
      rules: [R('10.2', 'Goaltender Ring', 75), R('9.4', 'Goaltender with the ring', 59)], signals: ['goaltender-ring', 'five-second-count'] },

    { id: 'shot-clock', kind: 'basic', title: 'The 30-second shot clock',
      short: 'A team has 30 seconds to get a shot on goal, or it loses the ring.',
      body: [
        'The shot clock starts at 30 seconds each period and after every goal.',
        'It resets when the team with the ring takes a shot on goal, when the other team gains control, or when a delayed penalty is signalled.',
        'A shot on goal means it goes in, hits a post or the crossbar, hits the goalie in her crease, or hits the goalie outside the crease and that stops a goal. A shot off the post counts.',
        'If it reaches zero, play stops and the other team gets the ring.'
      ],
      rules: [R('24.1', 'Shot on goal', 176), R('24.3', 'Shot clock rules', 176)], signals: ['shot-clock-reset'] },

    { id: 'violations-penalties', kind: 'basic', title: 'Violations vs. penalties',
      short: 'A violation costs you the ring. A penalty costs you a player.',
      body: [
        'Violations are breaking the playing rules: lines, crease, free pass, two blue line pass, kicking the ring with the toe and so on. The other team gets the ring.',
        'Penalties are for illegal play against an opponent, or for unsportsmanlike behaviour. The player sits in the penalty box and her team plays short-handed.',
        'If the team with the ring does it, play stops right away. If the other team does it, the ref signals a delayed violation or delayed penalty, and play carries on until that team gets the ring.'
      ],
      rules: [R('13.1', 'Consequences of violations', 106), R('20.2', 'Stoppage for penalties', 148)], signals: ['delayed-violation', 'delayed-penalty'] },

    { id: 'penalty-types', kind: 'basic', title: 'How long is each penalty?',
      short: 'Minor 2 min · Unsportsmanlike 2 min (full) · Major 4 min (full) · Misconduct and match: ejection.',
      body: [
        'Minor: 2 minutes. It can end early if the other team scores (see "When does a goal end a penalty?").',
        'Unsportsmanlike conduct: 2 minutes, served in full.',
        'Major: 4 minutes, served in full.',
        'Misconduct: the player is ejected, and a teammate serves a 2-minute unsportsmanlike penalty.',
        'Match: the player is ejected and suspended for the next game, and a teammate serves a 4-minute major.',
        'Penalty time is actual playing time, and a penalized player can\'t be replaced on the ice.'
      ],
      rules: [R('20.3', 'Penalty severity', 149), R('20.5', 'Serving penalties', 150)], signals: ['major', 'unsportsmanlike', 'misconduct-match'] },

    { id: 'timeouts', kind: 'basic', title: 'Timeouts',
      short: 'One 30-second timeout per team per game, plus one more for each full-length overtime.',
      body: [
        'Each team gets one 30-second timeout per game. It can only be asked for during a stoppage.',
        'Each full-length overtime period adds another one, and unused timeouts carry forward.',
        'Only one timeout per team per stoppage. If both teams call one, they run back to back.',
        'Players in the penalty box have to stay there during a timeout, and no rings are allowed on the ice.'
      ],
      rules: [R('6.5', 'Timeouts', 25), R('20.6', 'Penalty bench', 150)], signals: ['timeout'] },

    { id: 'restarts', kind: 'basic', title: 'Who gets the ring after a whistle?',
      short: 'After a goal, the team scored on. After a penalty, the other team, in its attacking end.',
      body: [
        'Start of the game: the visiting team takes a free pass at centre. The home team starts the second period, and it alternates after that.',
        'After a goal: the team scored against takes a free pass at centre.',
        'After a penalty: the non-penalized team takes a free pass in its attacking zone.',
        'After a violation: the other team gets the ring in the zone where play stopped. Some violations, like blue line violations, move the ring forward into the next zone.',
        'Overtime starts with a coin toss: the winner gets the free pass, and the other team picks its end.'
      ],
      rules: [R('10.3', 'Starting play', 77), R('10.4', 'Resuming play', 78)], signals: ['direction-of-play'] },

    { id: 'goalie-zones', kind: 'basic', title: 'Where can the goalie go?',
      short: 'Only in her own end and the middle zone, never the other team\'s end.',
      body: [
        'A goaltender may only play in her team\'s defending zone and the neutral (middle) zone.',
        'If she plays the ring in her attacking zone, that\'s a violation, and the other team gets the ring.',
        'Outside her crease she can stop the ring with her glove, but has to drop it right away.'
      ],
      rules: [R('9.2', 'Goaltender play', 58), R('9.5', 'Goaltender outside the crease', 63)], signals: [] },

    // ---------------- SITUATIONS ----------------
    { id: 'three-in-box', kind: 'situation', title: 'What happens with 3 in the penalty box?',
      short: 'Only two penalties run at once. The third player waits, and her time doesn\'t start until a teammate\'s ends.',
      body: [
        'A team can have at most two players serving penalties at the same time, so it never drops below three skaters.',
        'A third penalized player goes to the box anyway, but her clock doesn\'t start until one of the first two penalties ends. After that, penalties start in the order they were given.',
        'Here\'s the part people miss: when the first player\'s time is up, she can\'t go back on, because her team is still at its limit. She stays in the box until the next whistle.',
        'The same is true when two players are serving and a third penalty comes. A player whose time has run out waits for a stoppage.'
      ],
      rules: [R('21.1', 'Maximum two serving', 160), R('21.2', 'Additional penalized players', 160), R('21.3', 'Release from the box', 161)],
      signals: ['delayed-penalty'], diagram: 'box' },

    { id: 'five-on-three', kind: 'situation', title: 'On a 5-on-3, how many can be in the zone?',
      short: 'In her own end, the short team can only have 2 in the restricted area. In the other end, 3 is fine.',
      body: [
        'With two players in the box, a team plays with three skaters.',
        'At least one of them must stay outside the restricted area in her own end. So it\'s 2 defenders against 3 attackers down low.',
        'In the other end there\'s no such limit. All three of her skaters can go in on the attack.',
        'With only one penalty, the normal limit of three applies.'
      ],
      rules: [R('8.6.d', 'Free Play Line (two penalties)', 42)], signals: ['too-many-skaters'], diagram: 'twopen' },

    { id: 'goal-cancels', kind: 'situation', title: 'When does a goal end a penalty?',
      short: 'Only when the team scored on has more players penalized than the team that scored.',
      body: [
        'A goal against a short-handed team can cancel one minor penalty, including one that\'s still on delay.',
        'If two minors are being served, the one with the most time already served is cancelled.',
        'Unsportsmanlike and major penalties (served in full) are never cancelled by a goal.',
        'If the teams have the same number of players penalized, a goal cancels nothing.',
        'A cancelled delayed minor still goes on the game sheet and counts toward that player\'s penalty minutes.'
      ],
      rules: [R('21.4', 'Cancellation by a goal', 161)], signals: ['delayed-penalty', 'goal'] },

    { id: 'delayed-four', kind: 'situation', title: 'Why does the other team get 4 in the zone?',
      short: 'During a delayed penalty, the team that was fouled can send a fourth skater into the restricted area.',
      body: [
        'While a delayed penalty is being signalled, the non-penalized team can have four skaters in each restricted area.',
        'Many coaches also pull the goalie for an extra attacker. Play stops as soon as the penalized team gains control of the ring, so there\'s little risk.',
        'The shot clock also resets when a delayed penalty is signalled.',
        'If they score before the whistle, the delayed minor is usually cancelled (see "When does a goal end a penalty?").'
      ],
      rules: [R('8.6.b', 'Delayed penalty: four skaters', 42), R('24.3.d', 'Shot clock reset', 176)], signals: ['delayed-penalty', 'shot-clock-reset'], diagram: 'delayed' },

    { id: 'pulled-goalie', kind: 'situation', title: 'The goalie is pulled. Who guards the net?',
      short: 'The first defending skater to step into the crease becomes the "acting goaltender", with goalie privileges.',
      body: [
        'When a team swaps its goalie for an extra skater, it can have four skaters in each restricted area.',
        'The first defending skater to enter the crease becomes the acting goaltender (AGK). She can be swapped, but only once she has fully left the crease.',
        'The acting goaltender has five seconds to put a ring in the crease back into play, and only within her own end.',
        'She can\'t score: if she sends the ring into the other net, the goal doesn\'t count.'
      ],
      rules: [R('8.6.c', 'Goaltender substitution: four skaters', 42), R('9.6', 'Acting goaltender (AGK)', 65), R('11.4.g', 'Goal nullified', 95)], signals: [], diagram: 'pulled' },

    { id: 'awarded-goal', kind: 'situation', title: 'A goal with no shot? The awarded goal',
      short: 'If the net is empty and a breakaway is stopped by a penalty, the goal is simply awarded. No penalty shot.',
      body: [
        'When the goalie is pulled, the ref can award a goal outright. One case: an attacker is on a breakaway with her stick in the ring and no one to beat, and a defender\'s penalty stops the goal or a clear shot.',
        'Another case: a defender deliberately piles snow or puts something in or around the crease to stop a goal.',
        'A third: an extra defender, over the limit for the zone, deliberately goes in and stops a goal by playing as the acting goaltender.',
        'An awarded goal counts as a regular goal, including for cancelling penalties.'
      ],
      rules: [R('11.5', 'Awarded goal', 97)], signals: ['goal', 'penalty-shot'] },

    { id: 'last-two-minutes', kind: 'situation', title: 'The last two minutes: penalty shot territory',
      short: 'Late in the game and in overtime, some violations become penalty shots.',
      body: [
        'In the last two minutes of regulation and anytime in overtime, a penalty shot is given if an extra defender deliberately goes into (or stays in) her restricted area and gets involved in the play.',
        'The same goes for a defender who deliberately steps into the circle during the other team\'s free pass in that end and gets involved.',
        'Earlier in the game, the same plays are a violation or a delay of game penalty. Late in the game, they can cost a goal.'
      ],
      rules: [R('19.4', 'Penalty shot: last two minutes', 144)], signals: ['penalty-shot', 'too-many-skaters'] },

    { id: 'ten-minutes', kind: 'situation', title: 'Ten penalty minutes and you\'re done',
      short: 'Any player with 10 penalty minutes in a game is ejected.',
      body: [
        'A player who reaches 10 minutes of penalties in one game, overtime included, is ejected. A teammate serves the rest of her time.',
        'A delayed minor that was cancelled by a goal still counts toward that 10.',
        'In Ringette Ontario events, she\'s also suspended for the next game (see the Ontario suspensions card).'
      ],
      rules: [R('20.10.a', 'Excess penalty minutes', 155)], signals: ['misconduct-match'] },

    { id: 'goalie-penalty', kind: 'situation', title: 'The goalie takes a penalty. Who sits?',
      short: 'A teammate goes to the box for her.',
      body: [
        'A minor, unsportsmanlike or major penalty to the goaltender is served by a teammate, and the goalie stays in net. The coach picks who serves.',
        'An acting goaltender (a skater filling in while the goalie is pulled) serves her own penalty.',
        'If the goalie gets a misconduct or match penalty, she\'s ejected. A dressed backup goes straight in. If there\'s no backup, the team gets five minutes to dress another goalie, or plays with an acting goaltender.'
      ],
      rules: [R('20.9', 'Who serves the penalty', 154), R('20.10.b', 'Goalie ejection', 156)], signals: [] },

    { id: 'goalie-throw', kind: 'situation', title: 'Can the goalie score by throwing the ring?',
      short: 'No. A goalie throw into the other net (or off their goalie or a ref) doesn\'t count, and the other team gets the ring.',
      body: [
        'If a goalie throws the ring directly into the other team\'s net, or it goes in off their goalie or an official, the goal is disallowed.',
        'The other team gets a free pass in its attacking zone.',
        'A long goalie throw over her own blue line is legal, but her team can\'t take control in the middle zone for five seconds.'
      ],
      rules: [R('11.4.e', 'Goal nullified', 95), R('10.4.d', 'Ring award', 79), R('9.4.c', 'Goalie throw over the blue line', 59)], signals: ['wash-out'] },

    { id: 'own-goal', kind: 'situation', title: 'Who gets credit for an own goal?',
      short: 'The last attacking player to touch it. Off a free pass, the attacker closest to the net.',
      body: [
        'A ring that a defender puts into her own net counts. The exception is when it\'s caused by an attacker\'s penalty or violation.',
        'The goal (unassisted) goes to the last attacking player who touched or controlled the ring.',
        'If a team puts it in its own net straight off its own free pass or goaltender ring, the goal goes to the attacking player closest to the net. She may not have touched it at all!'
      ],
      rules: [R('11.2.a', 'Goals and assists', 90), R('11.3.d', 'Goal scored', 91)], signals: ['goal'] },

    { id: 'kicked-in', kind: 'situation', title: 'Can you kick the ring in?',
      short: 'Not directly. A kicked or batted ring that goes straight in, or in off the goalie, doesn\'t count.',
      body: [
        'A ring kicked or batted by an attacker into the net directly, off the defending goalie, or off an official is no goal.',
        'If a legally kicked or batted ring deflects in off any other player, the goal counts.',
        'Kicking the ring with the point of the toe or heel of the skate blade is a violation anywhere on the ice.',
        'Deflections count: a shot that goes in off any player or an official is a goal.'
      ],
      rules: [R('11.4.b', 'Goal nullified', 94), R('11.3.c', 'Goal scored', 91), R('12.2.e', 'Toe or heel kick', 99)], signals: ['toe-kick', 'wash-out'] },

    { id: 'frozen-ring', kind: 'situation', title: 'The ring is stuck. Who gets it?',
      short: 'Usually the team that got there second, the "second possession" rule.',
      body: [
        'If play stops because the ring can\'t be moved or played safely, it goes to the team that gained second control, the team that didn\'t have it first.',
        'The team that had it first keeps it only if the other team wasn\'t actively checking.',
        'This rewards checking instead of just pinning the ring along the boards.',
        'If the ring is lodged under the net or the boards, the team last in control gets it.'
      ],
      rules: [R('8.8', 'Immovable ring', 54), R('10.4.e', 'Ring out of play', 80)], signals: [] },

    { id: 'on-the-net', kind: 'situation', title: 'The ring lands on top of the net',
      short: 'Play stops, and the team that touched it last loses it.',
      body: [
        'If the ring comes to rest on the back, side or top of the net, play stops right away.',
        'It\'s a violation by the last player to touch it, so the other team gets the ring. The same goes for shooting it out of the rink.',
        'Knocking the net off its pegs so it affects the play is also a violation. Doing it on purpose to stop a goal is a penalty shot.'
      ],
      rules: [R('12.2.a', 'Violations', 99), R('12.2.b', 'Dislodging the net', 99), R('19.1.a', 'Penalty shot', 139)], signals: ['penalty-shot'] },

    { id: 'two-blue-washout', kind: 'situation', title: 'A two blue line pass that\'s waved off',
      short: 'If the other team doesn\'t go play the ring right away, the ref waves it off and play carries on.',
      body: [
        'When the ring goes untouched from one end to the other, a team-mate of the passer can\'t play it, but it\'s not called yet.',
        'The other team has to go to the ring and play it without delay. If they don\'t (or miss it), the ref gives the wash out signal and anyone can play it.',
        'A goalie who stays in her crease doesn\'t have to play it, unless it stops in or on the crease.',
        'If the ring touches any other player in the middle zone first, it was never a two blue line pass.'
      ],
      rules: [R('8.5.b', 'Two Blue Line Pass', 37)], signals: ['two-blue', 'wash-out', 'touch'] },

    { id: 'penalty-shot-rules', kind: 'situation', title: 'How a penalty shot works',
      short: 'Shooter against goalie, everyone else off the ice, and the shooter has to keep moving forward.',
      body: [
        'The game clock is stopped and every other player leaves the ice. The ring starts at centre.',
        'The shooter and the ring have to keep moving forward toward the goal line. The blue line rule doesn\'t apply, but the crease rules do.',
        'The goalie has to stay in her crease until the whistle. If she leaves early and the shot misses, it\'s taken again.',
        'If the other team distracts the shooter and she misses, it\'s taken again. If her own team distracts the goalie, the shot doesn\'t count.',
        'If the goalie\'s penalty stops a clear shot, the goal is awarded. A shooter who also took a penalty on the play shoots first, then serves.'
      ],
      rules: [R('22.5', 'Penalty shot procedure', 170), R('22.3', 'Selecting the shooter', 168)], signals: ['penalty-shot'] },

    { id: 'goal-or-not', kind: 'situation', title: 'Goal or no goal? The close calls',
      short: 'After the whistle, the buzzer or the shot clock horn: no goal (except on a penalty shot).',
      body: [
        'Once the whistle goes, or the game clock or shot clock runs out, a goal can\'t be scored. The only exception is a penalty shot.',
        'The whole ring has to be over the goal line. If the net is being knocked off as it goes in, it counts only if the ref is sure it crossed where the net would have been.',
        'If an ineligible player (an extra player, say) scores, assists or is on the ice for the goal, it doesn\'t count. That only applies if it\'s noticed before play restarts.',
        'If the attacking team breaks a rule before the ring goes in, the goal is waved off. The exception is when a defender\'s penalty caused it.'
      ],
      rules: [R('11.1', 'Goal scoring', 89), R('11.3.e', 'Goal scored', 91), R('11.4', 'Goal nullified', 94)], signals: ['goal', 'wash-out'] },

    // ---------------- RINGETTE ONTARIO ----------------
    { id: 'ro-mercy', kind: 'ontario', title: 'The 7-goal limit and running time',
      short: 'Scoreboards show at most a 7-goal lead, and the clock may run in the second half of a blowout.',
      body: [
        'Every goal goes on the game sheet, but the scoreboard and standings never show more than a 7-goal margin. For example, 12–1 shows as 8–1.',
        'Running time may be used only in the second half, once a team leads by 7. It goes back to stop time if the lead drops below 7.',
        'Penalties, injuries and timeouts still stop the clock during running time.'
      ],
      rules: [RO('5.7–5.8', 'Goal differential and running time')], signals: [] },

    { id: 'ro-overtime', kind: 'ontario', title: 'Overtime and standings',
      short: 'Tied games go to sudden-victory overtime, a full period long, repeated until someone scores.',
      body: [
        'A tied game goes to one overtime period as long as a regular period. The first goal wins.',
        'If no one scores, more stop-time sudden-victory periods follow. The free pass alternates and the teams switch ends each time.',
        'The ref tosses a coin for the first overtime free pass, and the team that loses the toss picks its end.',
        'In standings, a win is worth 2 points and a tie 1. If a tournament runs out of time, the host may declare a tie. A forfeit is recorded as 4–0.'
      ],
      rules: [RO('5.2–5.6, 6', 'Overtime and point structure')], signals: [] },

    { id: 'ro-suspensions', kind: 'ontario', title: 'Ejections and suspensions in Ontario',
      short: 'In Ontario, 10 penalty minutes also means sitting out the next game, and misconducts mean suspensions.',
      body: [
        'A player who reaches 10 penalty minutes (overtime included) is ejected and suspended for the next game.',
        'A head coach whose team reaches 30 penalty minutes in regulation is suspended for the next game.',
        'Misconduct: 1 game for a first offence in a season, 3 games for a second, 5 for a third, then a hearing.',
        'Match penalty: 2 games if it happens during play, 3 if after the game. Repeat match penalties bring much longer suspensions.',
        'Suspensions carry over between seasons, and between Ringette Ontario and Ringette Canada events.'
      ],
      rules: [RO('3.1–3.2, 4.4–4.6', 'Excessive penalties and suspensions')], signals: ['misconduct-match'] },

    { id: 'ro-game-length', kind: 'ontario', title: 'How long is a game?',
      short: 'Usually two halves. U14AA plays two 17-minute halves, and AA from U16 up plays four 10-minute quarters.',
      body: [
        'U14AA: two 17-minute periods.',
        'U16AA, U19AA and 18+AA (and 18+U): four 10-minute periods.',
        'Other divisions: the preferred format is two 15-minute periods. The document says "seventeen (15)" here, so check with your event.',
        'Hosts and leagues can change period length to fit ice time.'
      ],
      rules: [RO('5.1', 'Regulation game length')], signals: [] },

    { id: 'ro-three-on-three', kind: 'ontario', title: '3-on-3 tournaments: penalties become penalty shots',
      short: 'In Ontario 3-on-3 events, each minor earns the other team a penalty shot after the game.',
      body: [
        'Three skaters plus a goalie per side, two 8-minute periods, and changes on the fly.',
        'Penalties don\'t send anyone to the box. Each minor earns the other team 1 penalty shot and each major earns 2, all taken after the second period.',
        'After a goal, play restarts right away with a goaltender ring.',
        'If it\'s still tied, there\'s a shootout: three shooters each, then sudden victory.'
      ],
      rules: [RO('8', '3-on-3 format')], signals: ['penalty-shot'] },

    { id: 'ro-bench', kind: 'ontario', title: 'Who can be on the bench?',
      short: 'Up to five bench staff, and every team needs a qualified female coach who\'s 18 or older.',
      body: [
        'No more than five bench personnel at a time (head coach, assistants, junior coach and trainer).',
        'Every division and level needs at least one qualified female coach aged 18 or older. Open and Masters are exempt, and trainers and junior helpers don\'t count toward it.',
        'A game can\'t start without one eligible coach and one eligible trainer, and bench staff must sign the game sheet.'
      ],
      rules: [RO('1.2–1.6', 'Team rules')], signals: [] }
  ];

  // ---------------- DIAGRAMS ----------------
  // Rink to scale: 200 x 85 ft drawn as 312 x 150 (goal lines 11 ft, free play lines ~46 ft, blue lines 64 ft from the ends).
  let rinkN = 0;
  const RINK = (inner, opts = {}) => { const id = 'rk' + (++rinkN); return `<svg viewBox="0 0 320 172" role="img" class="rink">
    <defs><clipPath id="${id}"><rect x="4" y="4" width="312" height="150" rx="38"/></clipPath></defs>
    <rect x="4" y="4" width="312" height="150" rx="38" fill="#f4f8fb"/>
    <g clip-path="url(#${id})">
      ${opts.shadeR ? '<rect x="244" y="0" width="80" height="160" fill="#d6001c" opacity=".08"/>' : ''}
      ${opts.shadeL ? '<rect x="0" y="0" width="76" height="160" fill="#d6001c" opacity=".08"/>' : ''}
      <line x1="104" y1="0" x2="104" y2="160" stroke="#2f6fd6" stroke-width="4"/><line x1="216" y1="0" x2="216" y2="160" stroke="#2f6fd6" stroke-width="4"/>
      <line x1="76" y1="0" x2="76" y2="160" stroke="#d6001c" stroke-width="1.4"/><line x1="244" y1="0" x2="244" y2="160" stroke="#d6001c" stroke-width="1.4"/>
      <line x1="21" y1="0" x2="21" y2="160" stroke="#d6001c" stroke-width="1"/><line x1="299" y1="0" x2="299" y2="160" stroke="#d6001c" stroke-width="1"/>
    </g>
    <rect x="4" y="4" width="312" height="150" rx="38" fill="none" stroke="#9aa6b2" stroke-width="2"/>
    <path d="M21 66.5a12.5 12.5 0 0 1 0 25" fill="#cfe0f5" stroke="#d6001c"/><path d="M299 66.5a12.5 12.5 0 0 0 0 25" fill="#cfe0f5" stroke="#d6001c"/>
    <circle cx="160" cy="79" r="23" fill="none" stroke="#d6001c"/>
    ${[[52, 40], [52, 118], [268, 40], [268, 118]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="23" fill="none" stroke="#d6001c" stroke-width=".9"/>`).join('')}
    ${inner}
    <text x="76" y="167" font-size="8" text-anchor="middle" fill="#666" font-family="system-ui">free play line</text>
    <text x="244" y="167" font-size="8" text-anchor="middle" fill="#666" font-family="system-ui">free play line</text>
    <text x="160" y="167" font-size="8" text-anchor="middle" fill="#666" font-family="system-ui">${opts.mid || ''}</text></svg>`; };
  const A = (x, y, n) => `<g><circle cx="${x}" cy="${y}" r="7.5" fill="#d6001c" stroke="#fff" stroke-width="1.5"/>${n ? `<text x="${x}" y="${y + 3}" font-size="8" font-weight="800" text-anchor="middle" fill="#fff" font-family="system-ui">${n}</text>` : ''}</g>`;
  const B = (x, y, n) => `<g><circle cx="${x}" cy="${y}" r="7.5" fill="#111" stroke="#fff" stroke-width="1.5"/>${n ? `<text x="${x}" y="${y + 3}" font-size="8" font-weight="800" text-anchor="middle" fill="#fff" font-family="system-ui">${n}</text>` : ''}</g>`;
  const G = (x, y, team) => `<g><rect x="${x - 7}" y="${y - 7}" width="14" height="14" rx="3" fill="${team === 'A' ? '#d6001c' : '#111'}" stroke="#fff" stroke-width="1.5"/><text x="${x}" y="${y + 3}" font-size="8" font-weight="800" text-anchor="middle" fill="#fff" font-family="system-ui">G</text></g>`;
  const BAD = (x, y) => `<circle cx="${x}" cy="${y}" r="11" fill="none" stroke="#d6001c" stroke-width="1.6" stroke-dasharray="3 2"/>`;
  const LEG = (items) => `<div class="legend">${items.map(([c, t]) => `<span><i class="dot ${c}"></i>${t}</span>`).join('')}</div>`;

  const DIAGRAMS = {
    even: {
      svg: RINK(`${G(27, 79, 'B')}${G(292, 79, 'A')}
        ${A(262, 50)}${A(272, 108)}${A(288, 134)}${A(226, 92)}${A(176, 40)}
        ${B(254, 82)}${B(284, 30)}${B(256, 132)}${B(228, 48)}${B(232, 128)}`, { shadeR: true, mid: 'even strength' }),
      caption: 'Even strength in red\'s end: 3 red and 3 black skaters inside the restricted area (shaded, behind the free play line). The other skaters must stay outside it.',
      legend: [['a', 'Defending team'], ['b', 'Attacking team']]
    },
    twopen: {
      svg: RINK(`${G(27, 79, 'B')}${G(292, 79, 'A')}
        ${A(268, 56)}${A(270, 106)}${A(226, 80, '3')}
        ${B(254, 82)}${B(284, 30)}${B(284, 130)}${B(226, 40)}${B(226, 122)}`, { shadeR: true, mid: 'red has 2 in the box' }),
      caption: 'Red is down two and defending on the right. Only 2 of red\'s 3 skaters may be in the restricted area. Skater 3 must stay outside, so it\'s 2 against 3 down low. At the other end, all 3 red skaters could go in.',
      legend: [['a', 'Short-handed team (3 skaters)'], ['b', 'Power play team (5 skaters)']]
    },
    delayed: {
      svg: RINK(`${G(27, 79, 'B')}${G(292, 79, 'A')}
        ${A(272, 54)}${A(276, 110)}${A(256, 96)}${A(226, 82)}${A(180, 120)}
        ${B(252, 36)}${B(256, 66)}${B(252, 128)}${B(288, 132)}${B(226, 44)}`, { shadeR: true, mid: 'delayed penalty on red' }),
      caption: 'A delayed penalty is signalled on red. Black, the fouled team, can have 4 skaters in the restricted area until red gains control of the ring.',
      legend: [['a', 'Team that took the penalty'], ['b', 'Fouled team (may have 4 in)']]
    },
    pulled: {
      svg: RINK(`<text x="37" y="82" font-size="8.5" font-weight="700" fill="#666" font-family="system-ui">empty net</text>${G(292, 79, 'A')}
        ${A(272, 54)}${A(276, 110)}${A(256, 96)}${A(226, 82)}${A(180, 120)}
        ${B(252, 36)}${B(256, 66)}${B(252, 128)}${B(288, 132)}${B(226, 44)}${B(150, 79)}`, { shadeR: true, mid: 'black pulled its goalie' }),
      caption: 'Black has pulled its goalie for a sixth skater, so 4 black skaters may be in the restricted area. Black\'s own net is empty. If red heads that way, the first black skater to step into that crease becomes the acting goaltender.',
      legend: [['a', 'Defending team'], ['b', 'Team with goalie pulled (4 in)']]
    },
    box: {
      svg: `<svg viewBox="0 0 320 150" role="img" class="rink">
        <rect x="10" y="20" width="300" height="96" rx="10" fill="#f4f8fb" stroke="#9aa6b2" stroke-width="2"/>
        <text x="160" y="14" font-size="10" font-weight="800" text-anchor="middle" fill="#666" font-family="system-ui">PENALTY BOX</text>
        ${[[60, '#2', '0:00', 'Time\'s up, but she has to wait for the whistle', '#666'], [160, '#7', '0:48', 'Serving', '#d6001c'], [260, '#11', '2:00', 'Waiting: her clock hasn\'t started', '#666']].map(([x, n, t, s, c]) => `
          <circle cx="${x}" cy="56" r="17" fill="#d6001c" stroke="#fff" stroke-width="2"/><text x="${x}" y="61" font-size="12" font-weight="800" text-anchor="middle" fill="#fff" font-family="system-ui">${n}</text>
          <rect x="${x - 26}" y="80" width="52" height="20" rx="5" fill="#111"/><text x="${x}" y="94" font-size="12" font-weight="800" text-anchor="middle" fill="${t === '0:00' ? '#ff6b78' : '#fff'}" font-family="ui-monospace,monospace">${t}</text>
          <foreignObject x="${x - 48}" y="118" width="96" height="32"><div xmlns="http://www.w3.org/1999/xhtml" style="font:600 8.5px system-ui;color:${c};text-align:center;line-height:1.15">${s}</div></foreignObject>`).join('')}
      </svg>`,
      caption: 'Three players from the same team are in the box. #7\'s penalty is running, and #11 waits her turn. #2\'s time has run out, but her team can\'t go above 3 skaters, so she stays in the box until play stops.',
      legend: []
    }
  };

  CARDS.forEach((c) => { c.search = (c.title + ' ' + c.short + ' ' + c.body.join(' ')).toLowerCase(); });
  window.RULE_CARDS = CARDS;
  window.RULE_DIAGRAMS = DIAGRAMS;
  window.RO_PDF = RO_PDF;
})();
