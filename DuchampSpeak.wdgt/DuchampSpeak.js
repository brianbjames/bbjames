/*	
.      .


  .      .
DuchampSpeak Version 1.2
      .     .                                          .     .
http://www.bbjames.com
        .    .                                       .    .     
admin@bbjames.com, bjames@mills.com, brian.james@apple.com      
            .   .                                  .   .    
Copyright(C)2007 Brian B. James sp029, Some code (c) Joel Edlund 2007
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

/*The NUMBEROFQUOTES var, the randomDuchampQuote function, and the getQuote function were obtained from the widget "homerQuotes" by Joel Edlund (http://homerquotes.wordpress.com/ with permission by the author. HomerQuote can be downloaded at http://www.apple.com/downloads/dashboard/movie_tv/homerquotes.html */
var NUMBEROFQUOTES = 38;

function randomDuchampQuote(n)
{
	var quote = new Array();
	var randomIndex = Math.floor(Math.random() * NUMBEROFQUOTES);

	quote[0] = "The word 'art' interests me very much. If it comes from Sanskrit, as I've heard, it signifies 'making.'";
	quote[1] = "All in all, the creative act is not performed by the artist alone.. the spectator brings the work in contact with the external world by deciphering and interpreting its inner qualifications and thus adds his contribution to the creative act.";
	quote[2] = "Unless a picture shocks, it is nothing.";
	quote[3] = "I wanted to put painting once again at the service of the mind.";
	quote[4] = "I believe that the artist doesn't know what he does. I attach even more importance to the spectator than to the artist.";
	quote[5] = "When artist and spectator play a game of chess it is like designing something or constructing a mechanism of some kind. The competitive side of it has no importance.";
	quote[6] = "Society takes what it wants. The artist himself does not count, because there is no actual existence for the work of art. The work of art is always based on the two poles of the onlooker and the maker, and the spark that comes from the bipolar action gives birth to something - like electricity. But the onlooker has the last word, and it is always posterity that makes the masterpiece. The artist should not concern himself with this, because it has nothing to do with him.";
	quote[7] = "The creative act is not performed by the artist alone; the spectator brings the work in contact with the external world by deciphering and interpreting its inner qualifications and thus adds his contribution to the creative act.";
	quote[8] = "The word 'art' interests me very much. If it comes from Sanskrit, as I've heard, it signifies 'making.'";
	quote[9] = "The creative act is not formed by the artist alone; the spectator brings the work in contact with the external world by deciphering and interpreting its inner qualifications and thus adds his contribution to the creative act.";
	quote[10] = "The life of an artist is like the life of a monk, a lewd monk if you like, very Rabelaisian. It is an ordination.";
	quote[11] = "The individual, man as a man, man as a brain, if you like, interests me more than what he makes, because I've noticed that most artists only repeat themselves.";
	quote[12] = "No, the thing to do is try to make a painting that will be alive in your own lifetime...";
	quote[13] = "It's true, of course, humor is very important in my life, as you know. That's the only reason for living, in fact.";
	quote[14] = "I consider painting as a means of expression, not as a goal.";
	quote[15] = "The individual, man as a man, man as a brain, if you like, interests me more than what he makes, because I've noticed that most artists only repeat themselves.";
	quote[16] = "Aesthetic delectation is the danger to be avoided.";
	quote[17] = "An abstract painting need in 50 years by no means look 'abstract' any longer.";
	quote[18] = "Art is an outlet toward regions which are not ruled by time and space.";
	quote[19] = "In the creative act, the artist goes from intention to realization through a chain of totally subjective reactions.";
	quote[20] = "I thought to discourage aesthetics... I threw the bottlerack and the urinal in their faces and now they admire them for their aesthetic beauty.";
	quote[22] = "In my day artists wanted to be outcasts, pariahs. Now they are all integrated into society.";
	quote[23] = "Art has absolutely no existence as veracity, as truth.";
	quote[24] = "All in all, the creative act is not performed by the artist alone; the spectator brings the work in contact with the external world by deciphering and interpreting its inner qualifications and thus adds his contribution to the creative act. This becomes even more obvious when posterity gives its final verdict and sometimes rehabilitates forgotten artists.";
	quote[25] = "I am still a victim of chess. It has all the beauty of art - and much more. It cannot be commercialized. Chess is much purer than art in its social position.";
	quote[26] = "The individual, man as a man, man as a brain, if you like, interests me more than what he makes, because I've noticed that most artists only repeat themselves.";
	quote[27] = "I don't believe in art. I believe in artists.";
	quote[28] = "Chess can be described as the movement of pieces eating one another.";
	quote[29] = "I am interested in ideas, not merely in visual products.";
	quote[30] = "The individual, man as a man, man as a brain, if you like, interests me more than what he makes, because I've noticed that most artists only repeat themselves.";
	quote[31] = "All in all, the creative act is not performed by the artist alone; the spectator brings the work in contact with the external world by deciphering and interpreting its inner qualifications and thus adds his contribution to the creative act. This becomes even more obvious when posterity gives its final verdict and sometimes rehabilitates forgotten artists.";
	quote[32] = "Art is a habit-forming drug. That's all it is for the artist, for the collector, for anybody connected with it. Art has absolutely no existence as varacity, as truth. People speak of it with great, religious reverence, but I don't see why it is to be so much revered. I'm afraid I'm an agnostic when it comes to art. I don't believe in it with all the mystical trimmings. As a drug it's probably very useful for many people, very sedative, but as a religion it's not even as good as God.";
	quote[33] = "Art is like a shipwreck .. it's everyman for himself.";
	quote[34] = "The chess pieces are the block alphabet which shapes thoughts; and these thoughts, although making a visual design on the chess-board, express their beauty abstractly, like a poem... I have come to the personal conclusion that while all artists are not chess players, all chess players are artists.";
	quote[35] = "I am still a victim of chess. It has all the beauty of art - and much more. It cannot be commercialized. Chess is much purer than art in its social position.";
	quote[36] = "I have forced myself to contradict myself in order to avoid conforming to my own taste.";
	quote[37] = "No obstinacy, ad absurdum, of hiding the coition through a glass pane with one or many objects of the shop window. The penalty consists in cutting the pane and in feeling regret as soon as possession is consummated.";

	return quote[randomIndex];

}

function getQuote() 
{
	var newQuote = randomDuchampQuote(0);
	var stringSize = 10 + (50 / newQuote.length) * 10;
	
	document.getElementById("box").innerHTML = "\"" + newQuote + "\"";
	document.getElementById("box").style.font = stringSize + "px \"Helvetica\"";
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