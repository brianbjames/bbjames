/*	
.      .


  .      .
SartreSpeak Version 1.1
      .     .                                          .     .
http://www.bbjames.com
        .    .                                       .    .     
admin@bbjames.com, bjames@mills.com, brian.james@apple.com      
            .   .                                  .   .    
Copyright(C)2007 Brian B. James sp031, Some code (c) Joel Edlund 2007
                .  .                            .  .
Some code (C)2005 Apple Computer, Inc.       . .
                         ..               ..
This widget is freeware            .
*/

function load()
{
	var SartreSpeak = document.getElementById("SartreSpeak");
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


/*The NUMBEROFQUOTES var, the randomSartreQuote function, and the getQuote function were obtained from the widget "homerQuotes" by Joel Edlund (http://homerquotes.wordpress.com/. HomerQuote can be downloaded at http://www.apple.com/downloads/dashboard/movie_tv/homerquotes.html with permission by the author.*/
var NUMBEROFQUOTES = 101;

function randomSartreQuote(n)
{
	var quote = new Array();
	var randomIndex = Math.floor(Math.random() * NUMBEROFQUOTES);

quote[0] = "Nothingness slips in between my Self and my past and future.";
quote[1] = "Being does not increase or diminish.";
quote[2] = "The contingency of freedom is the fact that freedom is not able not to exist.";
quote[3] = "Being is.";
quote[4] = "Being is in-itelf.";
quote[5] = "Being is what it is.";
quote[6] = "Esse est percipi.";
quote[7] = "Existence. Concrete, individual being here and now.";
quote[8] = "Success is not important to freedom.";
quote[9] = "Phenomenon. Being as it appears or is revealed.";
quote[10] = "All my modes of being manifest freedom equally since they are all ways of being my own nothingness.";
quote[11] = "The being of an existent is exactly what it appears.";
quote[12] = "The reality of that cup is that it is there and that it is not me.";
quote[13] = "The appearance does not hide the essence, it reveals it; it is the essence.";
quote[14] = "The past is the in-itself which I am, but I am this in-itself as surpassed.";
quote[15] = "I think; therefore I was.";
quote[16] = "The present is for-itself.";
quote[17] = "At present it is not what it is (past) and it is what it is not (future).";
quote[18] = "The Present is not a new In-itself; it is what it is not, that which is beyond being; it is that of which we can say 'it is' only in the past.";
quote[19] = "Everything happens as if the Present were a perpetual hole in being - immediately filled up and perpetually reborn.";
quote[20] = "The consciousness of duration is a consciousness of a consciousness which endures.";
quote[21] = "Quality is.";
quote[22] = "If someone looks at me, I am conscious of being an object.";
quote[23] = "The body is the totality of meaningful relations to the world.";
quote[24] = "We resign ourselves to seeing ourselves through the Other's eyes.";
quote[25] = "My body as alienated escapes me toward a being-a-tool-among-tools.";
quote[26] = "My body is designated as alienated.";
quote[27] = "The beloved can not will to love.";
quote[28] = "I wish to engage in battle by making myself a fascinating object.";
quote[29] = "I make myself flesh in the presence of the Other in order to appropriate the Other's flesh.";
quote[30] = "I take and discover myself in the process of taking, but what I take in my hands is something else than what I wanted to take.";
quote[31] = "An act is a projection of the for-itself toward what it is not.";
quote[32] = "My ultimate and initial project - for these are but one - is, as we shall see, always the outline of a solution of the problem of being. But this solution is not first conceived and then realized; we are the solution.";
quote[33] = "If freedom is to be its own foundation, then the end must in addition turn back on existence and cause it to arise.";
quote[34] = "What is an obstacle for me may not be so for another.";
quote[35] = "My place is defined by the spatial order and by the particular nature of the 'thises' which are revealed to me on the ground of the world.";
quote[36] = "It is not possible for me not to have a place.";
quote[37] = "I must be 'what I have to be' by the very fact of escaping it.";
quote[38] = "My environment is made up of the instrumental-things which surrond me.";
quote[39] = "We can say that human reality is surprised by nothing.";
quote[40] = "It is the blow of the axe which reveals the axe, it is the hammering which reveals the hammer.";
quote[41] = "The world which allows itself to be revealed as French, proletarian, ect., is before all else a world which is illuminated by the For-itself's own ends, its own world.";
quote[42] = "We can 'wait for' only a determined event which equally determined processes are in the act of realizing.";
quote[43] = "Death, in fact, is only on its negative side the nihilation of my possibilities.";
quote[44] = "Death represents a total dispossesstion.";
quote[45] = "We work to live and we live to work.";
quote[46] = "I am the one by whom my past arrives in this world.";
quote[47] = "My body as alienated escapes me toward a being-a-sense-organ-apprehended-by-sense-organs.";
quote[48] = "My body as alienated escapes me...and this is accompanied by an alienated destruction and a concrete collapse of my world which flows toward the Other and which the Other will reapprehend in his world.";
quote[49] = "I am my possibilities only through the nihilation of being-in-itself which I have to be.";
quote[50] = "Death as the nihilation of a nihilation is a positing of my being as in-itself in the sense in which for Hegel the negation of a negation is an affirmation.";
quote[51] = "Space can not be a form, for it is nothing.";
quote[52] = "Space can not be a being. It is a moving relation between beings which are unrelated.";
quote[53] = "Consciousness is consciousness of something.";
quote[54] = "Value is everywhere and nowhere.";
quote[55] = "If nothing compels me to save my life, nothing prevents me from precipitating myself into the abyss.";
quote[56] = "I am the self which I will be, in the mode of not being it.";
quote[57] = "Anguish is precisely my consciousness of being my own future, in the mode on not-being.";
quote[58] = "Consciousness of being is the being of consciousness.";
quote[59] = "Man is the being through whom nothingness comes into the world.";
quote[60] = "The being by which Nothingness comes to the world must be its own Nothingness.";
quote[61] = "We see nothingness making the world iridescent, casting a shimmer over things.";
quote[62] = "Nothingness lies coiled in the heart of being - like a worm.";
quote[63] = "Nothingness stands at the origin of the negative judgment because it is itself negation.";
quote[64] = "Man is always seperated from what he is by all the breadth of the being which he is not.";
quote[65] = "It is in nothingness alone that being can be surpassed.";
quote[66] = "Being is that, and outside of that, nothing.";
quote[67] = "Consciousness is born supported by a being which is not itself.";
quote[68] = "We are here on the ground of being, not of knowledge.";
quote[69] = "The existence of consciousness comes from consciousness itself.";
quote[70] = "Every conscious existence exists as consciousness of existing.";
quote[71] = "To know is to know that one knows.";
quote[72] = "Shame realizes an intimate relation of myself to myself.";
quote[73] = "If animals are machines, why shouldn't the man whom I see pass in the street be one?";
quote[74] = "The existence of the world is measured by the knowledge which I have of it.";
quote[75] = "The Other is the one who excludes me by being himself, the one whom I exclude by being myself.";
quote[76] = "Consciousnesses are directly supposed by one another in a reciprocal imbrication of their being.";
quote[77] = "To come into existance, for me, is to unfold my distances from things and thereby to cause things 'to be there.'";
quote[78] = "For human reality, to be is to-be-there.";
quote[79] = "Can I not see and touch my hand while it is touching?";
quote[80] = "The eye is the point toward which all the objective lines converge.";
quote[81] = "My body is everywhere in the world.";
quote[82] = "My body's depth of being is for me this perpetual 'outside' of my most intimate 'inside.'";
quote[83] = "I make myself anybody when I try on shoes or uncork a bottle or go into an elevator or laugh in a theater.";
quote[84] = "It is indeed to me that the printed sentence is directed.";
quote[85] = "I can not determine whether it is my acts which gave birth to their acts or their acts which gave birth to mine.";
quote[86] = "An act is a projection of the for-itself toward what it is not.";
quote[87] = "The order of interpretation is purely chronological and not logical.";
quote[88] = " To choose to be an inferior artist is of necessity to wish to be a great artist; otherwise the inferiority would neither be suffered nor recognized.";
quote[89] = "The end, illuminating the world, is a state of the world to be obtained and not yet existing.";
quote[90] = "Suicide, in fact, is a choice and affirmation - of being.";
quote[91] = "Freedom is the freedom of choosing but not the freedom of not choosing. Not to choose is, in fact, to choose to not choose.";
quote[92] = "Freedom is condemned to be free.";
quote[93] = "Essence is what has been.";
quote[94] = "In fact, to be able to modify a situation is precisely to make a situation exist.";
quote[95] = "I exist my body.";
quote[96] = "The man who wants to be loved does not desire the enslavement of the beloved.";
quote[97] = "Pleasure is the death and the failure of desire.";
quote[98] = "The sadist is the being who apprehends the Other as the instrument whose function is his own incarnation.";
quote[99] = "For whom do the laws of languge exist?";
quote[100] = "Nothingness slips in between my Self and my past and future.";

return quote[randomIndex];

}

function getQuote()
{
	var newQuote = randomSartreQuote(0);
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