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

#######################################################################################

require "./config.pl" || die "Can't require ./config.pl";
require "./encode.pl" || die "Can't require ./encode.pl";

$query = new CGI;
foreach $sparam ($query->param()) { $$sparam = $query->param($sparam); }

print "Content-type: text/html\n\n";

if ($get_code)
{
	$encrypt_text = "$name, $price, $shipping";
	$control = &hmac_hex($encrypt_text, $encrypt_key);	

	$code = qq~
		<div align="center">
		<center>
		<table border="1" cellpadding="5" cellspacing="0" bordercolordark="#808080">
		<tr>
		<td width="100%">
		&lt;form method="POST" action="$secure_url"><br>
		&lt;input type="hidden" name="name" value="$name"><br>
		&lt;input type="hidden" name="price" value="$price"><br>
		&lt;input type="hidden" name="shipping" value="$shipping"><br>
		&lt;input type="hidden" name="page" value="$page"><br>
		&lt;input type="hidden" name="control" value="$control">&nbsp;<br>
		&lt;input type="text" name="qty" size="4" value="1"><br>
		&lt;input type="submit" value="Add to Cart" name="order"><br>
		&lt;/form>
		</td>
		</tr>
		</table>
		</center>
		</div>
	~;
} else {
	$code = "";
}

&page;
exit;

############################################################
# Page
############################################################

sub page
{
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
		      <form method="POST">
		        <input type="hidden" name="get_code" value="yes">
		        <p align="center"><br>
		        <font face="Arial" size="2">$code</font></p>
		        <p align="center"><font face="Arial">
		      Just fill in the fields below and submit this form and it will give you
		      the html code to add for you html product page.<br><br>
		        <b>Product Information:</b></font></p>
		        <div align="center">
		          <center>
		          <table border="0" cellpadding="0" cellspacing="0">
		            <tr>
		              <td nowrap>
		                <p align="right"><font face="Arial"><b>Name: </b></font></td>
		              <td nowrap><font face="Arial">
                      <input type="text" name="name" size="48"></font></td>
		            </tr>
		            <tr>
		              <td nowrap>
		                <p align="right"><font face="Arial"><b>Price: </b></font></td>
		              <td nowrap><font face="Arial">
                      <input type="text" name="price" size="7"><font size="1">
		                - No \$ sign</font></font></td>
		            </tr>
		            <tr>
		              <td nowrap>
		                <p align="right"><font face="Arial"><b>Shipping: </b></font></td>
		              <td nowrap><font face="Arial">
                      <input type="text" name="shipping" size="7">
		                <font size="1">- No \$ sign</font></font></td>
		            </tr>
		            <tr>
		              <td nowrap valign="bottom">
		                <p align="right"><b><font face="Arial">HTML Page:</font></b></td>
		              <td nowrap><font size="1" face="Arial"><br>
                      Name of HTML page that this code is going to be added to.<br>
                      </font><font face="Arial">
                      <input type="text" name="page" size="16"><font size="1">
                      </font></font></td>
		            </tr>
		          </table>
		          </center>
		        </div>
		        <p align="center"><font face="Arial"><input type="submit" value="     Get Code     " name="code"></font></p>
		      </form>
<p align="center"><font face="Arial" size="2"><b>View Cart Link:</b> html-cart.cgi?display_cart=yes&amp;page=<font color="#008080">index.htm</font><br>
<b>Check Out Link:</b> html-cart.cgi?order_form=yes&amp;page=<font color="#008080">index.htm</font></font></p>
<p align="center"><font face="Arial" size="2">Just replace '<font color="#008080">index.htm</font>'
with the name of the page that you are placing this link on.</font></p>


		      </td>
		  </tr>
		</table>
		<p align="center"><font size="2" face="Arial"><a href="orders.cgi">Orders Wizard</a>
		| <a href="code.cgi">Code Wizard</a> | <a href="password.cgi">Password</a></font></p>
		<p align="center"><font size="1" face="Arial"><a href="http://www.html-cart.com" target="_blank">http://www.html-cart.com</a></font></p>
		</body>
		</html>
   ~;
}
