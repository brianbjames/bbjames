/*	
.      .


  .      .
iCage Version 1.2
      .     .                                          .     .
http://www.bbjames.com
        .    .                                       .    .     
admin@bbjames.com, bjames@mills.com, brian.james@apple.com      
            .   .                                  .   .    
Copyright(C)2007 Brian B. James sp010, Some code (c) Joel Edlund 2007
                .  .                            .  .
Some code (C)2005 Apple Computer, Inc.       . .
                         ..               ..
This widget is freeware            .
*/

function load()
{
	var iCage = document.getElementById("iCage");
	getQuote();
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


/*The NUMBEROFQUOTES var, the randomCageQuote function, and the getQuote function were obtained from the widget "homerQuotes" by Joel Edlund (http://homerquotes.wordpress.com/. HomerQuote can be downloaded at http://www.apple.com/downloads/dashboard/movie_tv/homerquotes.html with permission by the author.*/
var NUMBEROFQUOTES = 118;

function randomCageQuote(n)
{
	var quote = new Array();
	var randomIndex = Math.floor(Math.random() * NUMBEROFQUOTES);

quote[0] = "I doubt whether the computer will do what I did  even though i know that there is a button there for aleatoric arrangement of information.";
quote[1] = "Uniqueness is extremely close to being here and now.";
quote[2] = "Each thing has its own place.";
quote[3] = "I didn’t want anyone to do something he couldn’t do.";
quote[4] = "Life is one.";
quote[5] = "I doubt whether the computer will do what I did  even though i know that there is a button there for aleatoric arrangement of information.";
quote[6] = "I am here, and there is nothing to say.";
quote[7] = "Past is now and there is no future             it is rejected.";
quote[8] = "After all, nature is better than art.";
quote[9] = "My memory of what happened is not what happened.";
quote[10] = "Invade area’s where nothing’s definite.";
quote[11] = "If a lecture is informative, people can easily think that something is being done to them.";
quote[12] = "Giving up control so sounds can be sounds.";
quote[13] = "I had no argument against it.";
quote[14] = "Whereas if I give a lecture in such a way it is not clear what is being given  then people have to do something about it.";
quote[15] = "Everything that we come across is to the point.";
quote[16] = "I have no message and I don’t write masterpieces.";
quote[17] = "I enjoy everything.";
quote[18] = "Art, if you want a definition of it, is criminal action.";
quote[19] = "All sounds are useful in music if they occur in music.";
quote[20] = "Curiously enough, the twelve tone system has no zero in it.";
quote[21] = "The more egos you have, the better chance you have of eliminating the ego.";
quote[22] = "Suzuki never spoke loudly  when the weather was good, the windows were open, and the airplanes leaving la guardia flew directly overhead from time to time, drowning out whatever he had to say  he never repeated what had been said during the passage of the airplane.";
quote[23] = "Any kind of paper will do for seeing spots.";
quote[24] = "It must take the form of a paradox: a purposeful purposelessness or purposeless play.";
quote[25] = "Discourage it through your lack of interest in it.";
quote[26] = "Everything is present in the foreground.";
quote[27] = "What is surrealism?";
quote[28] = "There is no rest of life.";
quote[29] = "Interpenetration means that each one of those most honored ones of all is moving out in all directions, penetrating and being penetrated by every other one no matter what time or what the space.";
quote[30] = "Having no preconceptions.";
quote[31] = "The normal succession of events will be for each person to live for a hundred years.";
quote[32] = "Sleep whenever.";
quote[33] = "Sound is vibration  everything is vibrating      so there is no earthly reason why we cant hear everything.";
quote[34] = "Disorganization can result from the accumulation of organizations having fine differences.";
quote[35] = "The revolution will be simple  like falling off a log.";
quote[36] = "I no longer object to the word 'experimental.'";
quote[37] = "Unimpededness is seeing that in all of space each thing and each human being.";
quote[38] = "It is now possible for composers to make music directly.";
quote[39] = "You and i are inherently different and complimentary   together we average as zero  that is  as eternity.";
quote[40] = "If my work is accepted  i must move on to the point where it isn’t.";
quote[41] = "Communication without language.";
quote[42] = "More and more people will be using computers.";
quote[43] = "All the early documents about abstraction  cubism  and everything  refer to music.";
quote[44] = "The material is in flux.";
quote[45] = "Any sounds may occur in any combination and in any continuity.";
quote[46] = "In a quick change food intake will affect the health of the whole society.";
quote[47] = "There shall be no joint rehearsal until all the parts have been carefully prepared.";
quote[48] = "History will be a cycle of changes.";
quote[48] = "Nothing is accomplished by writing a piece of music.";
quote[49] = "Wherever we are  what we hear is mostly noise.";
quote[50] = "Process should imitate nature in its manner of operation.";
quote[51] = "We can substitute a more meaningful term: organization of sound.";
quote[52] = "No one loses nothing because nothing is securely possessed.";
quote[53] = "The truth is that everything causes everything else.";
quote[54] = "Inclusive rather than exclusive.";
quote[55] = "Furniture music was satie’s most far-reaching discovery  the concept of a music to which one did not have to listen.";
quote[56] = "technology as manifested";
quote[57] = "I don’t want it to mean anything      I want it to be.";
quote[58] = "To accept whatever comes  regardless of the consequences  is to be unafraid or to be full of that love which comes from a sense of at-oneness with whatever.";
quote[59] = "Challenged the distinction between art and life.";
quote[60] = "Looking for something irrelevant I found that I couldn’t find it.";
quote[61] = "Conflict wont be between people and people but between people and things.";
quote[62] = "To act is a miracle and needs everything and every me out of the way.";
quote[63] = "A sound does not view itself as thought.";
quote[64] = "The highest purpose is to have no purpose at all.";
quote[65] = "I don’t feel that I am being unfaithful to music when im drawing.";
quote[66] = "Anything is a delight  we do not possess it and thus need not fear its loss.";
quote[67] = "constrained random process";
quote[68] = "Which is more musical       a truck passing by a factory         or a truck passing by a music school?";
quote[69] = "To let sounds be themselves rather than vehicles.";
quote[70] = "Where are we going and what are we doing?";
quote[71] = "Indeterminacy";
quote[72] = "Sometimes people think of art as opportunities for self-expression  I think of it as an opportunity for self-alteration.";
quote[73] = "A cough or a baby crying will not ruin a good piece of modern music.";
quote[74] = "There is no such thing as silence.";
quote[75] = "Should be played so softly that one wasn’t sure whether he was hearing them or not.";
quote[76] = "Art can function as an experimental station in which one tries living.";
quote[77] = "Im full of these inconsistencies and see no reason why I shouldn’t be.";
quote[78] = "We are not committed to this or that.";
quote[79] = "We are all in the same boat.";
quote[80] = "Function of distractions         interruptions        welcome them        they give you the chance to know whether your disciplined.";
quote[81] = "You will never be able to give a satisfactory report even to yourself of just what happened.";
quote[82] = "just an attention to the activity of sounds";
quote[83] = "As I made more mistakes my manuscript became more colorful and finally it had so many colors.";
quote[84] = "The person is being disciplined not the work.";
quote[85] = "The least is the most.";
quote[86] = "My feelings belong  as it were, to me.";
quote[87] = "You will never be able to give a satisfactory report even to yourself of just what happened.";
quote[88] = "No silence exists that is not pregnant with sound.";
quote[89] = "I have no objection to dissonance.";
quote[90] = "music as a means of changing the mind ";
quote[91] = "Thats what Wittgenstein said about anything    he said the meaning of something was its use.";
quote[92] = "We are surrounded by sound.";
quote[93] = "Im devoted to the principle of originality not originality in the egotistic sense  but originality in the sense of doing something that it is necessary to do.";
quote[94] = "That when is when our intentions go down to zerothen suddenly you notice that the world is magical.";
quote[95] = "A tradition of breaking with tradition.";
quote[96] = "Taking twelve aspirin a day I did that for fifteen years I was finally.";
quote[97] = "intention vs non-intention";
quote[98] = "Art’s obscured the difference between art and life.";
quote[99] = "music as a means of changing the mind ";
quote[100] = "Therefore the question underlies the answers.";
quote[101] = "Free the mind from its desire to concentrate.";
quote[102] = "I don’t trust my imagination.";
quote[103] = "To be measured in terms of words or syllables.";
quote[104] = "organized ways of predicting";
quote[105] = "So I want to give up the traditional view that art is a means of self-expression for the view that art is a means of self-alternation.";
quote[106] = "We will change beautifully if we accept uncertainties of change  and this should affect any planning.";
quote[107] = "This is a value.";
quote[108] = "The past must be invented.";
quote[109] = "Something memorable always happens.";
quote[110] = "Projects involving many people and many interruptions go well.";
quote[111] = "We live in a global village.";
quote[112] = "Well they're thinking of art as entertainment and that isn’t what art is about.";
quote[113] = "We bake a cake          and it turns out         that              the        sugar was       not      sugar but salt                            I         no sooner       start        to           work         than the telephone         rings                  .";
quote[114] = "Well they're thinking of art as entertainment and that isn’t what art is about.";
quote[115] = "Schoenberg made structures neoclassically.";
quote[116] = "The basic thing is to do nothing.";
quote[117] = "Most people now cannot believe that ownership will go.";

return quote[randomIndex];

}

function getQuote() 
{
	var newQuote = randomCageQuote(0);
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