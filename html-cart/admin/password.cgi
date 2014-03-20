#!/usr/bin/perl -w

#######################################################################################
#                                                                                     #
#                                 HTML-CART                                           #
#                         http://www.html-cart.com                                    #
#                                                                                     #
# Copyright 2001 Internet Express Products                                            #
#                                                                                     #
# Version: 1.0                                              Last Modified 09/07/2002  #
#                                                                                     #
#######################################################################################
# License                                                                             #
#######################################################################################
#                                                                                     #                                                                #
# This software is offered as freeware.                                               #
# Permission to use, copy and distribute this software and its documentation is       #
# hereby granted, with the following restrictions:                                    #
#                                                                                     #
# You may only distribute this software FREE OF CHARGE, and all copies of the         #
# distributed package should contain all the UNMODIFIED files that are in the         #
# original distribution                                                               #
#                                                                                     #
# You are allowed to modify this software in any way you would like, but you may NOT  #
# distribute the modified  code. Modifications are to be distributed as patches to    #
# the released version.                                                               #
#                                                                                     #
# You are not allowed to use this software or any part of it for creating another     #
# program.                                                                            #
#                                                                                     #
# THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS ``AS IS'' AND   #
# ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED       #
# WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.  #
# IN NO EVENT SHALL THE AUTHOR OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,    #
# INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT        #
# LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR      #
# PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,   #
# WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)  #
# ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE          #
# POSSIBILITY OF SUCH DAMAGE.                                                         #
#                                                                                     #
#######################################################################################

use CGI qw(:standard);
use CGI::Carp qw/fatalsToBrowser/;

$query = new CGI;
foreach $sparam ($query->param()) { $$sparam = $query->param($sparam); }

print "Content-type: text/html\n\n";

print qq~
	<html>
	<head>
	<title>HTML-CART Code Wizard</title>
	</head>
	<body bgcolor="#FFFFFF">
	<table border="0" cellpadding="0" cellspacing="0" width="100%">
	<tr>
	<td width="100%" bgcolor="#502727">
	<p align="center"><font face="Arial"><br>
	<b><font size="5" color="#FFFFFF">HTML-CART Code Wizard<br>
	</font></b></font></td>
	</tr>
	<tr>
	<td width="100%">
~;

if ($password)
{
   my $letters = &random_letters(2);
   $c_password = crypt($password, $letters);
   open (PASSFILE, ">.htpasswd") || die "Unable to open/create .htpasswd file";
   print PASSFILE "$username\:";
   print PASSFILE "$c_password\n";
   close(PASSFILE);

   $mylength = length($ENV{'SCRIPT_FILENAME'})-13;
   $path = substr($ENV{'SCRIPT_FILENAME'},0,$mylength);
   open (ACCESSFILE, ">.htaccess") || die "Unable to open/create .htaccess file";
   print ACCESSFILE "Options All\n";
   print ACCESSFILE "AuthType \"Basic\"\n";
   print ACCESSFILE "AuthName \"Protected Access\"\n";
   print ACCESSFILE "AuthUserFile $path/.htpasswd\n";
#    print ACCESSFILE "<Limit GET POST>\n";
   print ACCESSFILE "require valid-user\n";
#    print ACCESSFILE "</Limit>\n";

   print qq~
   	<p>&nbsp;</p>
      <center>
      <p><font face="Arial">Your username $username and password $password ($c_password) has been set</font></p>
      </center>
   ~;
} else {

   print qq~
   	<p>&nbsp;</p>
      <form method="POST">
        <p align="center"><font face="Arial">Username: <input type="text" name="username" size="20"></font></p>
        <p align="center"><font face="Arial">Password: <input type="text" name="password" size="20"></font></p>
        <p align="center"><font face="Arial"><input type="submit" value="Submit"></font></p>
      </form>
   ~;
}

print qq~
	<p>&nbsp;</td>
	</tr>
	</table>
	<p align="center"><font size="2" face="Arial"><a href="orders.cgi">Orders Wizard</a>
	| <a href="code.cgi">Code Wizard</a> | <a href="password.cgi">Password</a></font></p>
	<p align="center"><font size="1" face="Arial"><a href="http://www.html-cart.com" target="_blank">http://www.html-cart.com</a></font></p>
	</body>
	</html>
~;

exit;

#########################################################################
# Random Letters
#########################################################################

sub random_letters
{
   my ($len) = @_;
   my $rdm;
   my $_rand;
   my @chars = split(" ", "A B C D E F G H I J K L M N O P Q R S T U V W X Y Z");

   srand;

   for (my $i=0; $i <= $len ;$i++)
   {
      $_rand = int(rand 25);
      $rdm .= $chars[$_rand];
   }

   return($rdm);
}
