#!/usr/bin/perl -Tw

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

#######################################################################################

print "Content-type: text/html\n\n";

require "./config.pl" || die "Can't require ./config.pl";

print qq~
	<html>
	<head>
	<title>HTML-CART Order Wizard</title>
   <META HTTP-EQUIV="Cache-Control" Content="no-cache">
   <META HTTP-EQUIV="Pragma" Content="no-cache">
	</head>
	<body bgcolor="#FFFFFF">
	<table border="0" cellpadding="0" cellspacing="0" width="100%">
	<tr>
	<td width="100%" bgcolor="#502727">
	<p align="center"><font face="Arial"><br>
	<b><font size="5" color="#FFFFFF">HTML-CART Order Wizard<br>
	</font></b></font></td>
	</tr>
	<tr>
	<td width="100%">
~;

if ($invoice)
{
   print qq~
      <div align="center">
      <center>
      <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse" bordercolor="#111111" width="90%">
      <tr>
      <td width="100%">
   ~;
   open (ORDERLOG, "./orders/$invoice");
   while (<ORDERLOG>)
	{
		s/\n/<br>\n/g;
      print "$_";
	}
   close (ORDERLOG);
   print qq~
      </td>
      </tr>
      </table>
      </center>
      </div>
   ~;
} elsif ($delete) {
	$delete =~ /([\w\-\=\+\/]+)/;
	$delete = "$1";
	$delete = "./orders/$delete";
	unlink $delete;
	&list_orders;
} else {
	&list_orders;
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

########################################################################

sub list_orders
{
	print qq~
		<div align="center">
		<center>
		<table border="0" cellpadding="0" cellspacing="0" width="50%">
		<tr>
		<td width="100%">
		<p>&nbsp;</p>
		<center>
		<p><font face="Arial">Here is a list of the orders that are currently in your
		order folder:<br><br>
		<center>
    ~;

   opendir(CURDIR,"./orders") || die("Cannot open Directory!");
   @names = grep(!/^\./, readdir(CURDIR));
   for $name (@names)
   {
      my $t = (split(/\./, $name))[0];
	   ($sec,$min,$hour,$mday,$mon,$year,$wday,$yday,$isdst) = localtime($t);
	   if ($hour < 10){$hour = "0$hour";}
	   if ($min < 10){$min = "0$min";}
	   if ($sec < 10){$sec = "0$sec";}

	   $year += 1900;
	   $mon++;
	   $date = "$mon\/$mday\/$year at $hour\:$min\:$sec";

   	print qq~
 			<a href="$secure_order_url?invoice=$name">$name</a>&nbsp;&nbsp;&nbsp;$date&nbsp;&nbsp;&nbsp;
 			<a href="orders.cgi?delete=$name">DELETE</a>
 			<br>
 		~;
   }

   print qq~
   	</font></p>
		</td>
		</tr>
		</table>
		</center>
		</div>
	~;
}
