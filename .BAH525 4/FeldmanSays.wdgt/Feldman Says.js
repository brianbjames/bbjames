/*	
.      .


  .      .
FeldmanSays Version 1.2
      .     .                                          .     .
http://www.bbjames.com
        .    .                                       .    .     
admin@bbjames.com, bjames@mills.com, brian.james@apple.com      
            .   .                                  .   .    
Copyright(C)2007 Brian B. James sp028, Some code (c) Joel Edlund 2007
                .  .                            .  .
Some code (C)2005 Apple Computer, Inc.       . .
                         ..               ..
This widget is freeware            .
*/

function load()
{
}

function remove()
{
}

function hide()
{
}

function show()
{
}

function showBack(event)
{
	var front = document.getElementById("front");
	var back = document.getElementById("back");
	if (window.widget)
		widget.prepareForTransition("ToBack");
	front.style.display="none";
	back.style.display="block";
	if (window.widget)
		setTimeout('widget.performTransition();', 0);
}

/*The NUMBEROFQUOTES var, the randomFeldmanQuote function, and the getQuote function were obtained from the widget "homerQuotes" by Joel Edlund (http://homerquotes.wordpress.com/ with permission by the author. HomerQuote can be downloaded at http://www.apple.com/downloads/dashboard/movie_tv/homerquotes.html */
var NUMBEROFQUOTES = 60;

function randomFeldmanQuote(n)
{
	var quote = new Array();
	var randomIndex = Math.floor(Math.random() * NUMBEROFQUOTES);
	
	quote[0] = "The painter achieves mastery by allowing what he is doing to be itself. In a way, he must step aside in order to be in control.";
	quote[1] = "Christian Wolff once remarked that everything eventually becomes a melody.";
	quote[2] = "Art teaches nothing about life, just as life teaches us nothing about art.";
	quote[3] = "One draws more freely on unruled paper.";
	quote[4] = "Stockhausen, a shrewd observer of the times, even wishes to create a 'nonprejudicial' art which will encompass all techniques at once. What he emerges with, however, is a Gargantuan eclecticism that virtually does away with the necessity for originality.";
	quote[5] = "To rebel against history is still to be a part of it.";
	quote[6] = "We were concerned with sound itself. And sound does not know its history.";
	quote[7] = "When Schoenberg, for instance, formulated his principle of composition with the twelve tones, he predicted this would extend the Germanic tradition of music for another hundred years. His greatest satisfaction in having devised something new seems to be that he extended something old. And for many, Schoenberg holds the key for to going back culturally, yet appearing to move forward artistically.";
	quote[8] = "Time simply must be left alone.";
	quote[9] = "Professionals insist on essentials. They concentrate on the things that make art.";
	quote[10] = "The 'freedom' of the artist is boring to him, because in freedom he cannot reenact the role of the artist.";
	quote[11] = "The attack of a sound is not its character. Actually, what we hear is the attack and not the sound. Decay, however, this departing landscape, this expresses where the sound exists in our hearing - leaving us rather than coming toward us.";
	quote[12] = "I was once told about a woman living in Paris - a descendant of Scriabin - who spent her entire life writing music not meant to be heard.";
	quote[13] = "The painter achieves mastery by allowing what he is doing to be itself. In a way, he must step aside in order to be in control.";
	quote[14] = "For art to succeed, its creator must fail.";
	quote[15] = "One never has an identity as an artist, but in a vague way remembers oneself in that role.";
	quote[16] = "The artist's life, remember, is a short one, the ordinary span of, say, seventy-odd. The audience, on the other hand, goes on for centuries, and is, in fact, immortal.";
	quote[17] = "It is Boulez, more than any composer today, who has given system a new prestige - Boulez, who once said in an essay that he is not interested in how a piece sounds, only in how it is made. No painter would talk that way.";
	quote[18] = "Varèse was one of the legendary performers. His instrument was sonority.";
	quote[19] = "Of course, the history of music is, in a sense, the history of its construction.";
	quote[20] = "'Nothing' is a strange alternative in art. We are continually faced with it while working.";
	quote[22] = "Willem de Kooning once said it is his final stroke that makes the picture.";
	quote[23] = "Duchamp once said that there was no such thing as art, only the artist. In this belief, Earle Brown and John Cage meet.";
	quote[24] = "When the performer is made more intensely aware of time, he also becomes more intensely aware of the action or sound he is about to play.";
	quote[25] = "The the whole, however, the campus composer allies himself with the Germanic musical tradition.";
	quote[26] = "Academic freedom seems to be the comfort of knowing one is free to be academic.";
	quote[27] = "Down with the masterpiece...up with art.";
	quote[28] = "I'm told the well-bred Englishman eats what is set before him without complaint.";
	quote[29] = "It may be strange to call Boulez and Stockhausen popularizers, but that's what they are. They glamorized Schoenberg and Webern, now they're glamorizing something else. But chance to them is just another procedure, another vehicle for new aspects of structure or of sonority independent of pitch organization. They could have gotten these things from Ives or Varèse, but they went to these men with too deep a prejudice, the prejudice of the equal, the colleague.";
	quote[30] = "I want everybody to get out of music. It’s too difficult. It requires immense talent for ideas, when not to use ideas. And a feeling for instruments, and a feeling for sound, and a natural feeling for proportion, not a didactic feeling for proportion, all these things. It’s very, very difficult. It’s very, very difficult. Music is very, very difficult. I don't even think it should be taught in universities anymore.";
	quote[31] = "What is teaching? Teaching is in a sense what happened with Hindemith. This is the story about Hindemith and Yale He says to somebody, 'You know, I invented a system where you can be stupid and get good results?' That was the whole idea—finding ways to make it democratic. It’s not democratic. I mean, composition is not democratic.";
	quote[32] = "Everything is open to interpretation!";
	quote[33] = "One of the problems I had with the early grid is that there was a tendency for it to be too design-oriented. It was very easy to make wonderful designs on the page, which I did.";
	quote[34] = "My whole generation was hung up on the 20 to 25 minute piece. It was our clock. We all got to know it, and how to handle it. As soon as you leave the 20-25 minute piece behind, in a one-movement work, different problems arise. Up to one hour you think about form, but after an hour and a half it's scale. Form is easy - just the division of things into parts. But scale is another matter. You have to have control of the piece - it requires a heightened kind of concentration. Before, my pieces were like objects...now, they're like evolving things.";
	quote[35] = "And then let's be fashionable and add, art died. It died a long time ago and what came after was analysis or sociology.";
	quote[36] = "Just as we have been given an Existentialism without God, we are now being given a music without the composer.";
	quote[37] = "We want Bach, but Bach himself is not invited to dinner. We don't need Bach, we have his ideas.";
	quote[38] = "The fact is Beethoven himself was once very annoyed when someone called him a composer. He wanted to be referred to as a tone poet.";
	quote[39] = "There's a parable of Kafka's about a man living in a country where he doesn't know the rules. Nobody will tell him what they are. He knows neither right nor wrong, but he observes that the rulers do not share his anxiety. From this he deduces that rules are for those who rule. What they do is the rule. That's why all my knowledge doesn't make me understand what Mozart did that I should also do in order to reach a state of artistic grace.";
	quote[40] = "Hindemith, who couldn't write a note without going back to his Bach, really should have kept out of it altogether.";
	quote[41] = "I knew I was going to be professional the day I first became practical. Practicality took the form of copying out my music neatly, keeping my desk tidy and organized - all the unimportant things that seem unrelated to the work, yet somehow do affect it.";
	quote[42] = "We might almost say that art is in pain, because it is unable to believe this deception is taking place. The artist feels his work is going badly because he is not reaching technical perfection.";
	quote[43] = "So maybe we have the answer, and technique is simply imitation.";
	quote[44] = "Renoir once said the same color, applied by two different hands, would give us two different tones. In music, the same note, written by two different composers, gives us - the same note.";
	quote[45] = "In painting if you hesitate, you become immortal, In music if you hesitate, you are lost.";
	quote[46] = "Control of the material is not really control. It is merely a device that brings us to the psychological benefits of process - just as relinquishing control brings us nothing more than the psychological benefits of a nonsystematic approach. In both cases, all we have gained is the intellectual comfort of having made a decision - the psychological comfort of having arrived at a point of view.";
	quote[47] = "Cézanne is not responsible for Picasso. But Picasso is responsible for Warhol.";
	quote[48] = "For the life of me, I can't tell which Mondrian succeeds and which fails - they are all so much a part of the same thing.";
	quote[49] = "Like a bad poker player, Schubert always shows his hand. But this very faultiness, this very failure is his virtue.";
	quote[50] = "Abstract Expressionism was not fighting the traditional historical position, not fighting authority, not fighting religion. This is what gives it that uniquely American tone...it did not inherit the polemical continuity of European art.";
	quote[51] = "Mondrian's final leap was out of the idiom - out of the classic enigma of painting altogether.";
	quote[52] = "The imagination builds its speculative fantasy on known facts.";
	quote[53] = "Can we say that the great choral music of the Renaissance is abstract? Quite the opposite. Josquin, who had a genius for making a gorgeous musical collection around a devotional word, uses music to convey a religious idea. Boulez, uses it to impress and dazzle the intellect by representing what seems to be the mountain peaks of human logic.";
	quote[54] = "It is becoming increasingly clear that there is no existing set of conditions on how to begin a work of art. One can begin with practically anything. This is just a matter of impetus, of energy, or wanting 'to do something.'";
	quote[55] = "Guston tells us he does not finish a painting but 'abandons it.'";
	quote[56] = "There is a strange propaganda that because someone composes or paints, what he necessarily wants is music or a picture.";
	quote[57] = "Completion is simply the perennial death of the artist.";
	quote[58] = "There are two subjects everyone gets excited about. One of them is politics, the other is art.";
	quote[59] = "What's wrong with leaving it nameless?";

	return quote[randomIndex];

}

function getQuote() 
{
	var newQuote = randomFeldmanQuote(0);
	var stringSize = 9 + (50 / newQuote.length) * 10;
	
	document.getElementById("box").innerHTML = "\"" + newQuote + "\"";
	document.getElementById("box").style.font = stringSize + "px \"Helvetica\"";
}

function showFront(event)
{
	var front = document.getElementById("front");
	var back = document.getElementById("back");
	if (window.widget)
		widget.prepareForTransition("ToFront");
	front.style.display="block";
	back.style.display="none";
	if (window.widget)
		setTimeout('widget.performTransition();', 0);
}

if (window.widget)
{
	widget.onremove = remove;
	widget.onhide = hide;
	widget.onshow = show;
}

function connect()
{
     var url;
     onclick = widget.openURL("http://www.bbjames.com");
}

function connectDownloads()
{
     var url;
     onclick = widget.openURL("http://www.bbjames.com/downloads.html");
}