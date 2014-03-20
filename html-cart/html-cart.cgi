#!/usr/bin/perl -Tw

#######################################################################################
#                                                                                     #
#                                 HTML-CART                                           #
#                         http://www.html-cart.com                                    #
#                                                                                     #
# Copyright 2006 Internet Express Products                                            #
#                                                                                     #
# Version: 2.2                                              Last Modified 02/24/2007  #
#                                                                                     #
#######################################################################################
# License                                                                             #
#######################################################################################
#                                                                                     #
# This software is offered as freeware.                                               #
# Permission to use, copy and distribute this software and its documentation is       #
# hereby granted, with the following restrictions:                                    #
#                                                                                     #
# You may only distribute this software FREE OF CHARGE, and all copies of the         #
# distributed package should contain all the UNMODIFIED files that are in the         #
# original distribution                                                               #
#                                                                                     #
# You are allowed to modify this software in any way you would like, but you may NOT  #
# distribute the modified code. Modifications are to be distributed as patches to     #
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

BEGIN { open (STDERR, ">html-cart.err");}

use CGI qw(:standard);
use CGI::Carp qw/fatalsToBrowser/;

# configuration variables
our ($gateway_url, $store_name, $encrypt_key, $taxable_state, $taxable_rate);
our ($default_country, @credit_cards, $admin_email, $html_prd_pages, $template_file);
our ($secure_url, $secure_order_url, $domain_name_for_cookie, $path_for_cookie, $currency_symbol);

our ($BillTo_Zip_error, $ShipTo_Zip_error, $Payment_Card_Type_error, $Payment_Card_Exp_Year_error);
our ($BillTo_Name_error, $ShipTo_State_error, $Fax_Number_error, $BillTo_State_error);
our ($ShipTo_City_error, $Payment_Card_Exp_Month_error, $ShipTo_Country_error, $Payment_Card_Number_error);
our ($Phone_Number_error, $ShipTo_Name_error, $BillTo_City_error, $BillTo_Country_error);
our ($ShipTo_Street_Line1_error, $BillTo_Street_Line1_error, $Payment_Card_Id_error);
#######################################################################################
# Variables
#######################################################################################

require "./admin/config.pl" || die "Can't require ./admin/config.pl";
require "./admin/encode.pl" || die "Can't require ./admin/encode.pl";

$ENV{"PATH"} = "";

our $flags = "-t";

$mailer  = '/usr/lib/sendmail';
$mailer1 = '/usr/bin/sendmail';
$mailer2 = '/usr/sbin/sendmail';
if ( -e $mailer) {
    $mail_program=$mailer;
} elsif( -e $mailer1){
    $mail_program=$mailer1;
} elsif( -e $mailer2){
    $mail_program=$mailer2;
} else {
    print "Content-type: text/html\n\n";
    print "I can't find sendmail, shutting down...<br>";
    print "Whoever set this machine up put it someplace weird.";
    exit;
}

our $mail_program = "$mail_program $flags ";

&GetCookies;

if ($cookie{'IP'})
{
   $REMOTE_ADDRESS = $cookie{'IP'};
   $REMOTE_ADDRESS =~ /(\d+)\.(\d+)\.(\d+)\.(\d+)/;
   $REMOTE_ADDRESS = "$1.$2.$3.$4";
} else {
   $REMOTE_ADDRESS = $ENV{'REMOTE_ADDR'};
   $REMOTE_ADDRESS =~ /(\d+)\.(\d+)\.(\d+)\.(\d+)/;
   $REMOTE_ADDRESS = "$1.$2.$3.$4";
   $cookie{'IP'} = $REMOTE_ADDRESS;
   &SetCookies;
}

$shopping_cart = "./shopping_carts/$REMOTE_ADDRESS";

%sc_order_form_array = ('BillTo_Name',            'Name',
                        'BillTo_Street_Line1',    'Billing Address Street',
                        'BillTo_City',            'Billing Address City',
                        'BillTo_State',           'Billing Address State',
                        'BillTo_Zip',             'Billing Address Zip',
                        'BillTo_Country',         'Billing Address Country',
                        'ShipTo_Name',            'Ship To Name',
                        'ShipTo_Street_Line1',    'Shipping Address Street',
                        'ShipTo_City',            'Shipping Address City',
                        'ShipTo_State',           'Shipping Address State',
                        'ShipTo_Zip',             'Shipping Address Zip',
                        'ShipTo_Country',         'Shipping Address Country',
                        'Phone_Number',           'Phone Number',
                        'Email_Address',          'Email',
                        'Payment_Card_Type',      'Type of Card',
                        'Payment_Card_Number',    'Card Number',
                        'Payment_Card_Id',        'Card Id',
                        'Payment_Card_Exp_Month', 'Card Expiration Month',
                        'Payment_Card_Exp_Year',  'Card Expiration Year');

@sc_order_form_required_fields = ("BillTo_Name",
                                  "BillTo_Street_Line1",
                                  "BillTo_City",
                                  "BillTo_State",
                                  "BillTo_Zip",
                                  "BillTo_Country",
                                  "Phone_Number",
                                  "Email_Address",
                                  "Payment_Card_Type",
                                  "Payment_Card_Number",
                                  "Payment_Card_Id",
                                  "Payment_Card_Exp_Month",
                                  "Payment_Card_Exp_Year");

#######################################################################################

$query = new CGI;
foreach $sparam ($query->param()) { $form_data{$sparam} = $query->param($sparam); }

&clear_old_carts;

if ($form_data{'continue_shopping'})
{
   print "Location: $html_prd_pages\/$form_data{'page'}\n\n";
}

print "Content-type: text/html\n\n";

open (TEMPLATE, "$template_file") || print "Cant open $template_file<br>\n";
while (<TEMPLATE>)
{
   if ($_ =~ /\{DATA\}/i){ last; }
   if (!($_ =~ /\{DATA\}/i)){print $_;}
}

if ($form_data{'order'})
{
	&add_to_cart;
	&display_cart;
} elsif ($form_data{'display_cart'}) {
	&display_cart;
} elsif ($form_data{'order_form'}) {
	&diplay_order_form;
} elsif ($form_data{'confirm_order'}) {
	&confirm_order;
} elsif ($form_data{'process_order'} || $form_data{'status'}) {
	&process_order;
	&thank_you_page;
} elsif ($form_data{'delete_line'}) {
	&delete_line;
	&display_cart;
} elsif ($form_data{'clear_cart'}) {
	unlink $shopping_cart;
	&display_cart;
} elsif ($form_data{'update_changes'}) {
	&update_changes;
	&display_cart;
} else {
	print "INVALID COMMAND!";
}

while (<TEMPLATE>)
{
   if (!($_ =~ /\{DATA\}/i)){print $_;}
}
close (TEMPLATE);

exit;

############################################################
# Custom Shipping Calculations
############################################################

sub custom_shipping
{
   my ($shipping);

   # You can write your own custom code here to calculate shipping
   # and it will be added to the product shipping total.

   $shipping = 0;

   return($shipping);
}

############################################################
# Add to Cart
############################################################

sub add_to_cart
{
	my ($new_control, $line, $encrypt_text);

	$encrypt_text = "$form_data{'name'}, $form_data{'price'}, $form_data{'shipping'}";
	$new_control = &hmac_hex($encrypt_text, $encrypt_key);

	if ($new_control eq $form_data{'control'})
	{
		$line = 100;
		open (CART, "$shopping_cart");
		while (<CART>)
		{
			my @cart_data = split (/\|/, $_);
			if ($cart_data[0] > $line){$line = $cart_data[0];}
		}
		close (CART);
		$line++;

	   open (ADDCART, "+>>$shopping_cart") || print "Error: Adding to cart, you should check the permissions on your /shopping_carts/ folder.";
	   print ADDCART "$line\|$form_data{'qty'}\|$form_data{'name'} $form_data{'option'}\|$form_data{'price'}\|$form_data{'shipping'}\|$new_control\n";
	   close (ADDCART);
   } else {
   	print qq~
   	   ERROR! Price and Shipping do not match control number!
   	~;
   }
}

############################################################
# Delete from Cart
############################################################

sub delete_line
{
	my ($cart_lines);

	open (CART, "$shopping_cart") || print "Cant delete from shopping cart.";
	while (<CART>)
	{
		my @cart_data = split (/\|/, $_);
		if (!($cart_data[0] eq $form_data{'delete_line'}))
		{
			$cart_lines .= $_;
		}
	}
	close (CART);

	open (CART, ">$shopping_cart") || print "Cant write to shopping cart.";
	print CART $cart_lines;
	close (CART);
}

############################################################
# Update Cart
############################################################

sub update_changes
{
	my ($cart_lines);

	open (CART, "$shopping_cart") || print "Cant open shopping cart.";
	while (<CART>)
	{
		my @cart_data = split (/\|/, $_);
		$key = "qty-" . $cart_data[0];
		$cart_lines .= "$cart_data[0]\|$form_data{$key}\|$cart_data[2]\|$cart_data[3]\|$cart_data[4]\|$cart_data[5]";
	}
	close (CART);

	open (CART, ">$shopping_cart") || print "Cant write to shopping cart.";
	print CART $cart_lines;
	close (CART);
}

############################################################
# Display Cart
############################################################

sub display_cart
{
	my ($prd_count, $cart_html, $shipping_total);
   my ($subtotal, $sales_tax, $shipping_total, $grandtotal) = 0;

	open (CART, "$shopping_cart");
	while (<CART>)
	{
		$prd_count++;
		my @cart_data       = split (/\|/, $_);
		my $line            = $cart_data[0];
		my $qty             = $cart_data[1];
		my $name            = $cart_data[2];
		my $price           = $cart_data[3];
		my $shipping        = $cart_data[4];
		my $ext_amount      = $qty * $price;
		$shipping_total    += $qty * $shipping;
		$subtotal          += $ext_amount;
		$ext_amount         = sprintf ("%.2f", $ext_amount);
		my $display_price      = &display_price($price);
		my $display_ext_amount = &display_price($ext_amount);

		$cart_html .= qq~
			<!-- START CART $line -->
			<tr>
		~;

		if (!($form_data{'confirm_order'}))
		{
			$cart_html .= qq~
				<td valign="top" class="delete_link">
				<a href="html-cart.cgi?delete_line=$line&page=$form_data{'page'}">DELETE</a>
				</td>
			~;
		}

		$cart_html .= qq~
			<td valign="top" class="cart_quantity">
		~;

		if ($form_data{'confirm_order'})
		{
			$cart_html .= $qty;
		} else {
			$cart_html .= qq~
				<input type="text" name="qty-$line" size="4" value="$qty">
			~;
		}

		$cart_html .= qq~
			</td>

			<td width="100%" valign="top" class="cart_name">$name</td>
			<td valign="top" align="right" class="cart_price">$display_price</td>
			<td valign="top" align="right" class="cart_extamount">$display_ext_amount</td>
			</tr>
			<!-- END CART $line -->
		~;

	}
	close (CART);

	$form_data{'ShipTo_State'} =~ tr/a-z/A-Z/;
	$form_data{'ShipTo_State'} =~ s/\.//g;

	if ($form_data{'ShipTo_State'} eq $taxable_state)
	{
		$sales_tax = sprintf ("%.2f", $subtotal * $taxable_rate);
	}

   $shipping_total += &custom_shipping;
   $shipping_total = sprintf ("%.2f", $shipping_total);
	$grandtotal = $shipping_total + $subtotal + $sales_tax;
	$subtotal = sprintf ("%.2f", $subtotal);
	$grandtotal = sprintf ("%.2f", $grandtotal);

	if ($prd_count)
	{
		&cart_header;
		print $cart_html;
		&cart_footer($subtotal, $sales_tax, $shipping_total, $grandtotal);
	} else {
		&empty_cart;
	}

	return($subtotal, $sales_tax, $shipping_total, $grandtotal);
}

############################################################
# Display Order Form
############################################################

sub diplay_order_form
{
   my ($row_count);

   my ($bill_countries, $ship_countries) = &country;

   open (CART, "$shopping_cart");
	while (<CART>)
	{
      $row_count++;
	}
	close (CART);

	if ($row_count)
	{
      ($sec,$min,$hour,$mday,$mon,$year,$wday,$yday,$isdst) = localtime(time);
      $year += 1900;

      $year = substr($year,2,2);

      $cc_year = $year;

      while ($cc_year <= ($year + 10))
      {
         $cc_years .= "<option>$cc_year</option>\n";
         $cc_year++;

         if ($cc_year < 10 && substr($cc_year,0,1) ne "0"){$cc_year = "0" . $cc_year;}
      }

      foreach $card (@credit_cards)
      {
         $cards_accepted .= "<option>$card</option>\n";
      }

      print qq~
         <FORM METHOD="post">
         <CENTER>
         <TABLE WIDTH="90%" BORDER="0" CELLPADDING="0">
         <TR>
         <TD colspan="2" valign="top">
           <hr noshade size="1" color="#000000">
         </TD>
         </TR>
         <TR>
         <TD colspan="2">

             <p>This is where you enter your billing
             information. This should be the same as the billing address on your credit
             card.</p>

         </TD>
         </TR>
         <TR>
         <TD COLSPAN="2" class="header_cell">Billing Name:</TD>
         </TR>
         <TR>
            <TD align="right" class="label_cell">Name:</TD>
            <TD>
               <INPUT TYPE="text" NAME="BillTo_Name" VALUE="$form_data{'BillTo_Name'}" SIZE="30" MAXLENGTH="30">
               <span class="order_error">$BillTo_Name_error</span>
            </TD>
         </TR>
         <TR>
            <TD align="right" class="label_cell">Street:</TD>
            <TD>
               <INPUT TYPE="text" NAME="BillTo_Street_Line1" SIZE="30" value="$form_data{'BillTo_Street_Line1'}">
               <span class="order_error">$BillTo_Street_Line1_error</span>
            </TD>
         </TR>
         <TR>
         <TD align="right" class="label_cell">City:</TD>
         <TD><INPUT TYPE="text" NAME="BillTo_City" SIZE="30" value="$form_data{'BillTo_City'}">
           <span class="order_error">$BillTo_City_error</span>
         </TR>
         <TR>
         <TD align="right" class="label_cell">State/Province/Region:</TD>
         <TD>
         <INPUT TYPE="text" NAME="BillTo_State" SIZE="4" MAXLENGTH="11" value="$form_data{'BillTo_State'}">
         <span class="order_error">$BillTo_State_error</span>
         </TR>
         <TR>
         <TD align="right" class="label_cell">ZIP/Postal Code:</TD>
         <TD><INPUT TYPE="text" NAME="BillTo_Zip" SIZE="11" MAXLENGTH="11" value="$form_data{'BillTo_Zip'}">
           <span class="order_error">$BillTo_Zip_error</span></TD>
         </TR>
         <TR>
         <TD align="right" class="label_cell">Country:</TD>
         <TD>
         <select name="BillTo_Country" size="1">
          <option value=""></option>
          $bill_countries
        </select>

           <span class="order_error">$BillTo_Country_error</span></TD>
         </TR>
         <TR>
         <TD COLSPAN="2">&nbsp;</TD>
         </TR>
         <TR>
         <TD COLSPAN="2">
           <hr noshade size="1" color="#000000">
         </TD>
         </TR>
         <TR>
         <TD COLSPAN="2">

             <p>If you would like to have your order shipped
             to an address other then the billing address then please fill out this
             section.</p>

         </TD>
         </TR>
         <TR>
         <TD COLSPAN="2" class="header_cell">Shipping Name:</TD>
         </TR>
         <TR>
         <TD align="right" class="label_cell">Name:</TD>
         <TD><INPUT TYPE="text" NAME="ShipTo_Name" SIZE="30" MAXLENGTH="30" value="$form_data{'ShipTo_Name'}">
           <span class="order_error">$ShipTo_Name_error</span></TD>
         </TR>
         <TR>
         <TD align="right" class="label_cell">Street:</TD>
         <TD><INPUT TYPE="text" NAME="ShipTo_Street_Line1" SIZE="30" value="$form_data{'ShipTo_Street_Line1'}">
           <span class="order_error">$ShipTo_Street_Line1_error</span></TD>
         </TR>
         <TR>
         <TD align="right" class="label_cell">City:</TD>
         <TD><INPUT TYPE="text" NAME="ShipTo_City" SIZE="30" value="$form_data{'ShipTo_City'}">
           <span class="order_error">$ShipTo_City_error</span></TD>
         </TR>
         <TR>
         <TD align="right" class="label_cell">State/Province/Region:</TD>
         <TD>
         <INPUT TYPE="text" NAME="ShipTo_State" SIZE="4" MAXLENGTH="11" value="$form_data{'ShipTo_State'}">
         <span class="order_error">$ShipTo_State_error</span></TD>
         </TR>
         <TR>
         <TD align="right" class="label_cell">ZIP/Postal Code:</TD>
         <TD><INPUT TYPE="text" NAME="ShipTo_Zip" SIZE="11" MAXLENGTH="11" value="$form_data{'ShipTo_Zip'}">
           <span class="order_error">$ShipTo_Zip_error</span></TD>
         </TR>
         <TR>
         <TD align="right" class="label_cell">Country:</TD>
         <TD>
          <select name="ShipTo_Country" size="1">
          <option value=""></option>
          $ship_countries
           <span class="order_error">$ShipTo_Country_error</span></TD>
         </TR>
         <TR>
         <TD COLSPAN="2">&nbsp;</TD>
         </TR>
         <TR>
         <TD COLSPAN="2">
           <hr noshade size="1" color="#000000">
         </TD>
         </TR>
         <TR>
         <TD COLSPAN="2">

             <p>Enter your contact information here so that
             if we need to contact you regarding your order. All contact information
             supplied is for company use only, and will not be given or sold to other
             companies.</p>

         </TD>
         </TR>
         <TR>
         <TD COLSPAN="2" class="header_cell">Contact Information:</TD>
         </TR>
         <TR>
         <TD align="right" class="label_cell">Phone:</TD>
         <TD><INPUT TYPE="text" NAME="Phone_Number" SIZE="15" MAXLENGTH="15" value="$form_data{'Phone_Number'}">
           <span class="order_error">$Phone_Number_error</span></TD>
         </TR>
         <TR>
         <TD align="right" class="label_cell">Fax:</TD>
         <TD><INPUT TYPE="text" NAME="Fax_Number" SIZE="15" MAXLENGTH="15" value="$form_data{'Fax_Number'}">
           <span class="order_error">$Fax_Number_error</span></TD>
         </TR>
         <TR>
         <TD align="right" class="label_cell">E-Mail:</TD>
         <TD><INPUT TYPE="text" NAME="Email_Address" MAXLENGTH="30" size="20" value="$form_data{'Email_Address'}">
           <span class="order_error">$Email_Address_error</span></TD>
         </TR>

         <TR>
         <TD COLSPAN="2">
         <hr noshade size="1" color="#000000">

             <p>Be careful to enter all credit card
             information correctly to avoid any delays in the shipping of your order.</p>

         </TD>
         </TR>
         <TR>
         <TD COLSPAN="2" class="header_cell">Credit Card Information:</TD>
         </TR>
         <TR>
         <TD align="right" class="label_cell">Card:</TD>
         <TD>
         <select size="1" name="Payment_Card_Type">
         <option>$form_data{'Payment_Card_Type'}</option>
         $cards_accepted
         </select>
         <span class="order_error">$Payment_Card_Type_error</span>
         </TD>
         </TR>
         <TR>
         <TD align="right" class="label_cell">Number:</TD>
         <TD><INPUT TYPE="text" NAME="Payment_Card_Number" MAXLENGTH="20" size="20" value="$form_data{'Payment_Card_Number'}">
           <span class="order_error">$Payment_Card_Number_error</span></TD>
          </TR>
         <TR>
         <TD align="right" class="label_cell">Card Id:</TD>
         <TD><INPUT TYPE="text" NAME="Payment_Card_Id" MAXLENGTH="5" size="5" value="$form_data{'Payment_Card_Id'}">
           <span class="order_error">$Payment_Card_Id_error</span></TD>
         </TR>
         <TR>
         <TD align="right" class="label_cell">Exp. Date:</TD>
         <TD>
         <SELECT NAME="Payment_Card_Exp_Month" size="1">
         <OPTION>$form_data{'Payment_Card_Exp_Month'}</OPTION>
         <OPTION>1</OPTION>
         <OPTION>2</OPTION>
         <OPTION>3</OPTION>
         <OPTION>4</OPTION>
         <OPTION>5</OPTION>
         <OPTION>6</OPTION>
         <OPTION>7</OPTION>
         <OPTION>8</OPTION>
         <OPTION>9</OPTION>
         <OPTION>10</OPTION>
         <OPTION>11</OPTION>
         <OPTION>12</OPTION>
         </SELECT>

         <SELECT NAME="Payment_Card_Exp_Year" size="1">
         <OPTION>$form_data{'Payment_Card_Exp_Year'}</OPTION>
          $cc_years
         </SELECT><span class="order_error">$Payment_Card_Exp_Month_error
         $Payment_Card_Exp_Year_error</span>
         </TD>
         </TR>
         <TR>
         <TD colspan="2">&nbsp;</TD>
         </TR>
         <TR>
         <TD colspan="2">
           <hr noshade size="1" color="#000000">
         </TD>
         </TR>
         </CENTER>
         <TR>
         <TD colspan="2">

             <p>If you have any comments or
             special instructions that you would like to send to us then please fill in
             that information here.</p>

         </TD>
         </TR>
         <TR>
         <TD colspan="2" class="header_cell">Special Instructions / Comments:</TD>
         </TR>
         <TR>
         <TD colspan="2">
           <p align="center"><textarea style="FONT-SIZE: 10pt" name="comments" rows="3" cols="43">$form_data{'comments'}</textarea></TD>
         </TR>
         <TR>
         <TD colspan="2">
         </TD>
         </TR>
         <TR>
         <TD colspan="2">
           <hr noshade size="1" color="#000000">
         </TD>
         </TR>
         </TABLE>
         <CENTER>
         <INPUT TYPE="hidden" NAME="confirm_order"  VALUE=" Confirm Order ">
         <INPUT TYPE="submit" NAME="confirm_order"  VALUE=" Confirm Order ">
         <BR>
         </CENTER>
         </FORM>
      ~;
   } else {
      &empty_cart;
   }
}

############################################################
# Confirm Order
############################################################

sub confirm_order
{
   $required_fields_filled_in = "yes";

   foreach $required_field (@sc_order_form_required_fields)
   {
      if ($form_data{$required_field} eq "")
      {
         $required_fields_filled_in = "no";
         $field = $required_field . "_error";
         ${$field} = "You forgot $sc_order_form_array{$required_field}";
      }
   }

   if (! &valid_address($form_data{'Email_Address'}))
   {
      $required_fields_filled_in = "no";
      $Email_Address_error = "Please enter a valid email address!";
   }

   if ($required_fields_filled_in eq "yes") {
      &confirmation_page;
   } else {
      &diplay_order_form;
   }
}

############################################################
# Confirmation Page
############################################################

sub confirmation_page
{
	my ($control);

	if (! $form_data{'ShipTo_Name'})        {$form_data{'ShipTo_Name'}         = $form_data{'BillTo_Name'};}
	if (! $form_data{'ShipTo_Street_Line1'}){$form_data{'ShipTo_Street_Line1'} = $form_data{'BillTo_Street_Line1'};}
	if (! $form_data{'ShipTo_City'})        {$form_data{'ShipTo_City'}         = $form_data{'BillTo_City'};}
	if (! $form_data{'ShipTo_State'})       {$form_data{'ShipTo_State'}        = $form_data{'BillTo_State'};}
	if (! $form_data{'ShipTo_Zip'})         {$form_data{'ShipTo_Zip'}          = $form_data{'BillTo_Zip'};}
	if (! $form_data{'ShipTo_Country'})     {$form_data{'ShipTo_Country'}      = $form_data{'BillTo_Country'};}

	my ($subtotal, $sales_tax, $shipping_total, $grandtotal) = &display_cart;

	$encrypt_text = "$subtotal, $shipping_total, $sales_tax, $grandtotal";
	$control = &hmac_hex($encrypt_text, $encrypt_key);

   $comments = $form_data{'comments'};
   $comments =~ s/\r\n/<br>/g;
   $comments =~ s/\n/<br>/g;
   $comments =~ s/\"/\&quot\;/g;

   if (-f "./admin/gateway.pl")
   {
      require "./admin/gateway.pl";
   }

   my $oid = time . "." . $$;

#    $sc_passthrough_variables->{'taxexempt'}      = 'taxexempt';
#    $sc_passthrough_variables->{'shippingmethod'} = 'shipMethod';
#    $sc_passthrough_variables->{'discountamount'} = 'pass_final_discount';

	print qq~
		<FORM METHOD="post" action="$gateway_url">
		<!-- Gateway Settings -->
		<input type="hidden" name="2000"           value="Submit">
		<input type="hidden" name="mode"           value="fullpay">
		<input type="hidden" name="oid"            value="$oid">
		<input type="hidden" name="userid"         value="$REMOTE_ADDRESS">
		<input type="hidden" name="storename"      value="$store_name">
		<input type="hidden" name="ordnum" 		    value="$oid">
		<input type="hidden" name="custnum" 	    value="$REMOTE_ADDRESS">
		<!-- Amounts -->
		<input type="hidden" name="subtotalamount" value="$subtotal">
		<input type="hidden" name="shippingamount" value="$shipping_total">
		<input type="hidden" name="salestaxamount" value="$sales_tax">
		<input type="hidden" name="chargetotal"    value="$grandtotal">
		<input type="hidden" name="CONTROL"        value="$control">

		<!-- Billing Address -->
		<input type="hidden" name="bname"          value="$form_data{'BillTo_Name'}">
		<input type="hidden" name="baddr1"         value="$form_data{'BillTo_Street_Line1'}">
		<input type="hidden" name="bcity"          value="$form_data{'BillTo_City'}">
		<input type="hidden" name="bstate"         value="$form_data{'BillTo_State'}">
		<input type="hidden" name="bzip"           value="$form_data{'BillTo_Zip'}">
		<input type="hidden" name="bcountry"       value="$form_data{'BillTo_Country'}">

		<!-- Shipping Address -->
		<input type="hidden" name="sname"          value="$form_data{'ShipTo_Name'}">
		<input type="hidden" name="saddr1"         value="$form_data{'ShipTo_Street_Line1'}">
		<input type="hidden" name="scity"          value="$form_data{'ShipTo_City'}">
		<input type="hidden" name="sstate"         value="$form_data{'ShipTo_State'}">
		<input type="hidden" name="szip"           value="$form_data{'ShipTo_Zip'}">
		<input type="hidden" name="scountry"       value="$form_data{'ShipTo_Country'}">

		<!-- Contact Information -->
		<input type="hidden" name="phone"         value="$form_data{'Phone_Number'}">
		<input type="hidden" name="fax"           value="$form_data{'Fax_Number'}">
		<input type="hidden" name="email"         value="$form_data{'Email_Address'}">

		<!-- Billing Data -->
		<input type="hidden" name="cctype"        value="$form_data{'Payment_Card_Type'}">
		<input type="hidden" name="cardnumber"    value="$form_data{'Payment_Card_Number'}">
		<input type="hidden" name="cid"           value="$form_data{'Payment_Card_Id'}">
		<input type="hidden" name="expmonth"      value="$form_data{'Payment_Card_Exp_Month'}">
		<input type="hidden" name="expyear"       value="$form_data{'Payment_Card_Exp_Year'}">
		<input type="hidden" name="COMMENTS"      value="$comments">
   ~;

   print qq~
		<TABLE WIDTH="100%" CELLPADDING="4" CELLSPACING="0">

		<tr>
		<TD colspan="2">
		<b>Please verify all of the information on this page!</b><br>
		When you are confident that it is correct click the <b>'Submit Order For Processing'</b> button below and the order will be processed.
		</TD>
		</TR>

		<TR>
		<TD colspan="2">&nbsp;</TD>
		</TR>

      <!-- Billing Address -->
		<TR>
		<TD class="header_cell" colspan="2">Billing Address:</TD>
		</TR>

		<TR>
		<TD class="label_cell">Name:</TD>
		<TD class="value_cell">$form_data{'BillTo_Name'}</TD>
		</TR>

		<TR>
		<TD class="label_cell">Street:</TD>
		<TD class="value_cell">$form_data{'BillTo_Street_Line1'}</TD>
		</TR>

		<TR>
		<TD class="label_cell">City:</TD>
		<TD class="value_cell">$form_data{'BillTo_City'}</TD>
		</TR>

		<TR>
		<TD class="label_cell">State:</TD>
		<TD class="value_cell">$form_data{'BillTo_State'}</TD>
		</TR>

		<TR>
		<TD class="label_cell">Zip:</TD>
		<TD class="value_cell">$form_data{'BillTo_Zip'}</TD>
		</TR>

		<TR>
		<TD class="label_cell">Country:</TD>
		<TD class="value_cell">$form_data{'BillTo_Country'}</TD>
		</TR>

		<TR>
		<TD class="label_cell">&nbsp;</TD>
		<TD class="value_cell">&nbsp;</TD>
		</TR>

		<!-- Shipping Address -->
		<TR>
		<TD class="header_cell" colspan="2">Shipping Address:</TD>
		</TR>

		<TR>
		<TD class="label_cell">Name:</TD>
		<TD class="value_cell">$form_data{'ShipTo_Name'}</TD>
		</TR>

		<TR>
		<TD class="label_cell">Street:</TD>
		<TD class="value_cell">$form_data{'ShipTo_Street_Line1'}</TD>
		</TR>

		<TR>
		<TD class="label_cell">City:</TD>
		<TD class="value_cell">$form_data{'ShipTo_City'}</TD>
		</TR>

		<TR>
		<TD class="label_cell">State:</TD>
		<TD class="value_cell">$form_data{'ShipTo_State'}</TD>
		</TR>

		<TR>
		<TD class="label_cell">Zip:</TD>
		<TD class="value_cell">$form_data{'ShipTo_Zip'}</TD>
		</TR>

		<TR>
		<TD class="label_cell">Country:</TD>
		<TD class="value_cell">$form_data{'ShipTo_Country'}</TD>
		</TR>

		<TR>
		<TD class="label_cell">&nbsp;</TD>
		<TD class="value_cell">&nbsp;</TD>
		</TR>

		<TR>
		<TD class="header_cell" colspan="2">Contact:</TR>

		<TR>
		<TD class="label_cell">Phone:</TD>
      <TD class="value_cell">$form_data{'Phone_Number'}</TD>
		</TR>

		<TR>
		<TD class="label_cell">Fax:</TD>
      <TD class="value_cell">$form_data{'Fax_Number'}</TD>
		</TR>

		<TR>
		<TD class="label_cell">Email:</TD>
      <TD class="value_cell">$form_data{'Email_Address'}</TD>
		</TR>

		<TR>
		<TD class="label_cell">&nbsp;</TD>
		<TD class="value_cell">&nbsp;</TD>
		</TR>

		<TR>
		<TD class="header_cell" colspan="2">Comments:</TR>

		<TR>
		<TD colspan="2">$comments</TD>
		</TR>

		<TR>
		<TD colspan="2">
		<div class="process_order_button">
		<INPUT TYPE=SUBMIT NAME="process_order" VALUE="Submit Order For Processing">
		</div>
		</TD>
		</TR>
		</TABLE>

      </FORM>
	~;
}

############################################################
# Process Order
############################################################

sub process_order
{
   my ($ord_data);

	my $encrypt_text = "$form_data{'subtotalamount'}, $form_data{'shippingamount'}, $form_data{'salestaxamount'}, $form_data{'chargetotal'}";
	my $new_control  = &hmac_hex($encrypt_text, $encrypt_key);

   unless ($new_control eq $form_data{'CONTROL'})
   {
		$pay_data .= qq~
			ALERT: It appears that the totals for the order have been
			tampered with in some way so you should carefully validate this
			order before shipping the products.\n\n
		~;
	}

   $oid = $form_data{'oid'};
   $oid =~ /(\d+)/;
   $oid = "$1";

   ($sec,$min,$hour,$mday,$mon,$year,$wday,$yday,$isdst) = localtime(time);
   if ($hour < 10){$hour = "0$hour";}
   if ($min < 10){$min = "0$min";}
   if ($sec < 10){$sec = "0$sec";}

   $year += 1900;
   $mon++;
   $date = "$mon\/$mday\/$year at $hour\:$min\:$sec";

	$ord_data .= "Date: $date\n";
	$ord_data .= "Order Number: $form_data{'oid'}\n\n";

	$ord_data .= "BILLING INFORMATION:\n";
	$ord_data .= "$form_data{'bname'}\n";
	$ord_data .= "$form_data{'baddr1'}\n";
	$ord_data .= "$form_data{'bcity'}, $form_data{'bstate'}\. $form_data{'bzip'}\n";
	$ord_data .= "$form_data{'bcountry'}\n\n";

	$ord_data .= "SHIPPING INFORMATION:\n";
	$ord_data .= "$form_data{'sname'}\n";
	$ord_data .= "$form_data{'saddr1'}\n";
	$ord_data .= "$form_data{'scity'}, $form_data{'sstate'}\. $form_data{'szip'}\n";
	$ord_data .= "$form_data{'scountry'}\n\n";

	$ord_data .= "CONTACT INFORMATION:\n";
	$ord_data .= "Phone: $form_data{'phone'}\n";
	$ord_data .= "Fax: $form_data{'fax'}\n";
	$ord_data .= "E-mail: $form_data{'email'}\n\n";

	$ord_data .= "Product Information:\n";

	open (CART, "$shopping_cart");
	while (<CART>)
	{
	   $cart_count++;
		@cart_data = split (/\|/, $_);
		$ord_data .= "$cart_data[1]  $cart_data[2]  $cart_data[3]\n";
	}
	close (CART);

   $form_data{'subtotalamount'}   = &display_price($form_data{'subtotalamount'});
   $form_data{'shippingamount'}   = &display_price($form_data{'shippingamount'});
   $form_data{'salestaxamount'}   = &display_price($form_data{'salestaxamount'});
   $form_data{'chargetotal'} = &display_price($form_data{'chargetotal'});

	$ord_data .= "----------------------------\n";
	$ord_data .= "Subtotal: $form_data{'subtotalamount'}\n";
	$ord_data .= "Shipping: $form_data{'shippingamount'}\n";
	$ord_data .= "Sales Tax: $form_data{'salestaxamount'}\n";
	$ord_data .= "GRAND TOTAL: $form_data{'chargetotal'}\n";
	$ord_data .= "----------------------------\n\n";

	$ord_data .= "COMMENTS:\n$form_data{'COMMENTS'}\n";

	$pay_data .= "PAYMENT INFORMATION\n";
	$pay_data .= "Card Type: $form_data{'cctype'}\n";
	$pay_data .= "Card Number: $form_data{'cardnumber'}\n";
	$pay_data .= "Card Id: $form_data{'cid'}\n";
	$pay_data .= "Expiration Date: $form_data{'expmonth'}\/$form_data{'expyear'}\n\n";

   if ($cart_count)
   {
      if (-f "./admin/express_gateway.pl")
      {
         require "./admin/express_gateway.pl" || die "Can't require ./admin/express_gateway.pl";
         ($status, $error_message) = &express_gateway;
      } else {
         $status = 1;
      }

      if ($status eq '1')
      {
         open (ORDERLOG, "+>>./admin/orders/$oid") || die "Cant Open Order";
   		print ORDERLOG "-" x 60 . "\n";
   		print ORDERLOG $pay_data;
   		print ORDERLOG $ord_data;
   		print ORDERLOG "-" x 60 . "\n";
   		close (ORDERLOG);

   		&send_mail ($admin_email, $form_data{'email'}, "Thank you for your order!", $ord_data);
   		&send_mail ($admin_email, $admin_email, "You have a new order!", $ord_data);

   		unlink $shopping_cart;
   	} else {
   		$error = 1;
   		print qq~
   			<b>There was an error processing your order!</b>

   			$error_message
   		~;
   	}
	}
}

############################################################
# Thank you page
############################################################

sub thank_you_page
{
	if (!($error))
	{
		print qq~
			<b>Thank you for your order!</b>

			<p>We have received your order and it will be shipped out immediately.</p>
			<p>A copy of the order has also been emailed to you for your records.</p>
		~;
		if ($cart_count)
		{
		   print qq~
		      Order #$form_data{'oid'}
		   ~;
		}
	}
}

############################################################
# Send Mail
############################################################

sub send_mail
{
   my ($from, $to, $subject, $messagebody) = @_;

   my ($old_path) = $ENV{"PATH"};

   $ENV{"PATH"} = "";
   $ENV{ENV} = "";
   open (MAIL, "|$mail_program") || die ("Could Not Open Mail Program");
   $ENV{"PATH"} = $old_path;

   print MAIL qq~To: $to\n~;
   print MAIL qq~From: $from\n~;
   print MAIL qq~Subject: $subject\n\n~;
   print MAIL qq~$messagebody\n~;

   close (MAIL);
}

############################################################
# Cart Header
############################################################

sub cart_header
{
	print qq~
		<!-- START CART HEADER -->
		<form method="POST">
		<input type="hidden" name="page" value="$form_data{'page'}">
		<div align="center">
		<center>
		<table border="0" cellpadding="5" cellspacing="0" width="90%">
		<tr>
	~;

	if ($form_data{'confirm_order'})
	{
		print qq~
			<td valign="top" colspan="4">
		~;
	} else {
		print qq~
			<td valign="top" colspan="5">
		~;
	}

	print qq~
		<hr>
		</td>
		</center>
		</tr>
		<center>
		<tr>
	~;

	if (!($form_data{'confirm_order'}))
	{
		print qq~
			<td valign="top" class="header_cell">&nbsp;</td>
		~;
	}

	print qq~
		<td valign="top" class="header_cell">QTY</td>
		<td width="100%" valign="top" class="header_cell">Product Name</td>
		<td valign="top" class="header_cell" align="right">Price</td>
		<td valign="top" nowrap class="header_cell">Ext. Amount</td>
		</tr>
		<!-- END CART HEADER -->
	~;
}

############################################################
# Cart Footer
############################################################

sub cart_footer
{
	my ($subtotal, $sale_tax, $shipping_total, $grandtotal) = @_;

	$display_subtotal = &display_price($subtotal);
	$display_sale_tax = &display_price($sale_tax);
	$display_shipping = &display_price($shipping_total);
	$display_total    = &display_price($grandtotal);

	print qq~
		<!-- START CART FOOTER -->
		<tr>
	~;

	if ($form_data{'confirm_order'})
	{
		print qq~
			<td valign="top" colspan="4">
		~;
	} else {
		print qq~
			<td valign="top" colspan="5">
		~;
	}

	print qq~
		<hr>
		</td>
		</tr>
		<tr>
	~;

	if (!($form_data{'confirm_order'}))
	{
		print qq~
			<td valign="top"></td>
		~;
	}

	print qq~
		<td valign="top"></td>
		<td width="100%" valign="top"></td>
		<td valign="top" nowrap align="right" class="header_cell">Sub Total:</td>
		<td valign="top" align="right" class="value_cell">$display_subtotal</td>
		</tr>
	~;

   if ($form_data{'confirm_order'})
   {
   	if ($shipping_total)
   	{
   		print qq~
   			<tr>
   		~;

   		if (!($form_data{'confirm_order'}))
   		{
   			print qq~
   				<td valign="top"></td>
   			~;
   		}

   		print qq~
   			<td valign="top"></td>
   			<td width="100%" valign="top"></td>
   			<td valign="top" nowrap align="right" class="header_cell">Shipping:</td>
   			<td valign="top" align="right" class="value_cell">$display_shipping</td>
   			</tr>
   		~;
   	}

   	if ($sales_tax)
   	{
   		print qq~
   			<tr>
   		~;

   		if (!($form_data{'confirm_order'}))
   		{
   			print qq~
   				<td valign="top">&nbsp;</td>
   			~;
   		}

   		print qq~
   			<td valign="top">&nbsp;</td>
   			<td width="100%" valign="top">&nbsp;</td>
   			<td valign="top" nowrap align="right" class="header_cell">Sales Tax:</td>
   			<td valign="top" align="right" class="value_cell">$display_sale_tax</td>
   			</tr>
   		~;
   	}

   	print qq~
   		<tr>
   	~;

   	if (!($form_data{'confirm_order'}))
   	{
   		print qq~
   			<td valign="top"></td>
   		~;
   	}

   	print qq~
   		<td valign="top"></td>
   		<td width="100%" valign="top"></td>
   		<td valign="top" nowrap align="right" class="header_cell">Grand Total:</td>
   		<td valign="top" align="right" class="value_cell">$display_total</td>
   		</tr>
   	~;
	}


	print qq~
		</table>
		</div>
		<div align="center">
		<table border="0" cellpadding="0" cellspacing="0" width="90%">

	~;

	if (!($form_data{'confirm_order'}))
	{
		print qq~
			<tr>
			<td width="100%">
			<p align="left">&nbsp;</td>
			</tr>
			<tr>
			<td width="100%">
			<p align="right"><input type="submit" value="Update Changes" name="update_changes"></td>
			</tr>
			<tr>
			<td width="100%">&nbsp;</td>
			</tr>
			<tr>
			<td width="100%">
			<hr>
			</td>
			</tr>
		~;
	}

	print qq~
		</table>
		</div>
		</form>
	~;

	if (!($form_data{'confirm_order'}))
	{
		print qq~
			<div align="center">
			<center>
			<table border="0" cellpadding="10" cellspacing="0">
			<tr>
			<td>
			<form method="POST">
			<input type="hidden" name="page" value="$form_data{'page'}">
			<p align="center"><input type="submit" value="Continue Shopping" name="continue_shopping"></p>
			</form>
			</td>
			<td>
			<form method="POST">
			<input type="hidden" name="page" value="$form_data{'page'}">
			<p align="center"><input type="submit" value="    Clear Cart    " name="clear_cart"></p>
			</form>
			</td>
			<td>
			<form method="POST">
			<input type="hidden" name="page" value="$form_data{'page'}">
			<p align="center"><input type="submit" value="  Place Order  " name="order_form"></p>
			</form>
			</td>
			</tr>
			</table>
			</center>
			</div>
		~;
	}

	print qq~
		<!-- END CART FOOTER -->
	~;
}

############################################################
# Empty Cart
############################################################

sub empty_cart
{
	print qq~
	   <div class="empty_cart">
		<form method="POST">
		<input type="hidden" name="page" value="$form_data{'page'}">
		<p align="center">Your shopping cart is empty.</p>
		<p align="center"><input type="submit" value="Continue Shopping" name="continue_shopping"></p>
		</form>
		</div>
	~;
}

############################################################
# Clear Old Carts
############################################################

sub clear_old_carts
{
	opendir (USER_CARTS, "./shopping_carts") || print "Cant open shopping carts directory to clear old carts.";
	@carts = grep(/\.[0-9]/,readdir(USER_CARTS));
	closedir (USER_CARTS);

	foreach my $cart (@carts)
	{
      $cart =~ /(\d+)\.(\d+)\.(\d+)\.(\d+)/;
      $cart = "$1.$2.$3.$4";
		if (-M "./shopping_carts/$cart" > ".5")
		{
			unlink("./shopping_carts/$cart");
		}
	}
}

###########################################################
# Validate the email Address
###########################################################

sub valid_address
{
   my($addr) = @_;
   my($domain, $valid);

   return(0) unless ($addr =~ /^[^@]+@([-\w]+\.)+[A-Za-z]{2,4}$/);
   $domain = (split(/@/, $addr))[1];
   $valid = 1;

   return($valid);
}

############################################################
# Get Cookies
############################################################

sub GetCookies
{
   my ($chip, $val);

   foreach (split(/; /, $ENV{'HTTP_COOKIE'}))
   {
      s/\+/ /g;
      ($chip, $val) = split(/=/,$_,2);
      $chip =~ s/%([A-Fa-f0-9]{2})/pack("c",hex($1))/ge;
      $val =~ s/%([A-Fa-f0-9]{2})/pack("c",hex($1))/ge;
      $cookie{$chip} .= "\1" if (defined($cookie{$chip}));
      $cookie{$chip} .= $val;
   }
}

############################################################
# Set Cookie
############################################################

sub SetCookies
{
   my (@days) = ("Sun","Mon","Tue","Wed","Thu","Fri","Sat");
   my (@months) = ("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec");
   my ($sec,$min,$hour,$mday,$mon,$year,$wday);
   my ($time) = time;
   my (@secure) = ("","secure");

   $time += 86400;
   ($sec,$min,$hour,$mday,$mon,$year,$wday) = gmtime($time);

   $sec = "0" . $sec if $sec < 10;
   $min = "0" . $min if $min < 10;
   $hour = "0" . $hour if $hour < 10;

   $year += 1900;
   $expires = "expires\=$days[$wday], $mday-$months[$mon]-$year $hour:$min:$sec GMT; "; #form expiration from value passed to function.
   $sec = "0";

   local($key);
   foreach $key (keys %cookie)
   {
      $cookie{$key} =~ s/ /+/g;
      print "Set-Cookie: $key\=$cookie{$key}; $expires path\=$path_for_cookie; domain\=$domain_name_for_cookie; $secure[$sec]\n";
   }
}

###########################################################
# Country
###########################################################

sub country
{
   my (%country_array, %selected1, %selected2);
   my ($bill_countries, $ship_countries);

   unless ($form_data{'BillTo_Country'})
   {
      $form_data{'BillTo_Country'} = "US";
   }

   $selected1{"$form_data{'BillTo_Country'}"} = "selected";
   $selected2{"$form_data{'ShipTo_Country'}"} = "selected";

   %country_array =('United States','US',
                    'Albania', 'AL',
                    'Algeria', 'DZ',
                    'American Samoa', 'AS',
                    'Andorra','AD',
                    'Anguilla','AI',
                    'Antigua &amp; Barbuda','AG',
                    'Argentina','AR',
                    'Aruba','AW',
                    'Australia','AU',
                    'Austria','AT',
                    'Azores','AP',
                    'Bahamas','BS',
                    'Bahrain','BH',
                    'Bangladesh','BD',
                    'Barbados','BB',
                    'Belgium','BE',
                    'Belize','BZ',
                    'Belarus','BY',
                    'Benin','BJ',
                    'Bermuda','BM',
                    'Bolivia','BO',
                    'Bonaire','BL',
                    'Bosnia','BA',
                    'Botswana','BW',
                    'Brazil','BR',
                    'British Virgin Islands','VG',
                    'Brunei','BN',
                    'Bulgaria','BG',
                    'Burkina Faso','BF',
                    'Burundi','BI',
                    'Cambodia','KH',
                    'Cameroon','CM',
                    'Canada','CA',
                    'Canary Islands','IC',
                    'Cape Verde Islands','CV',
                    'Cayman Islands','KY',
                    'Central African Republic','CF',
                    'Chad','TD',
                    'Channel Islands','CD',
                    'Chile','CL',
                    'China, Peoples Republic of','CN',
                    'Colombia','CO',
                    'Congo','CG',
                    'Cook Islands','CK',
                    'Costa Rica','CR',
                    'Croatia','HR',
                    'Curacao','CB',
                    'Cyprus','CY',
                    'Czech Republic','CZ',
                    'Denmark','DK',
                    'Djibouti','DJ',
                    'Dominica','DM',
                    'Dominican Republic','DO',
                    'Ecuador','EC',
                    'Egypt','EG',
                    'El Salvador','SV',
                    'England','EN',
                    'Equitorial Guinea','GQ',
                    'Eritrea','ER',
                    'Estonia','EE',
                    'Ethiopia','ET',
                    'Faeroe Islands','FO',
                    'Federated States of Micronesia','FM',
                    'Fiji','FJ',
                    'Finland','FI',
                    'France','FR',
                    'French Guiana','GF',
                    'French Polynesia','PF',
                    'Gabon','GA',
                    'Gambia','GM',
                    'Georgia','GE',
                    'Germany','DE',
                    'Ghana','GH',
                    'Gibraltar','GI',
                    'Greece','GR',
                    'Greenland','GL',
                    'Grenada','GD',
                    'Guadeloupe','GP',
                    'Guam','GU',
                    'Guatemala','GT',
                    'Guinea','GN',
                    'Guinea-Bissau','GW',
                    'Guyana','GY',
                    'Haiti','HT',
                    'Holland','HO',
                    'Honduras','HN',
                    'Hong Kong','HK',
                    'Hungary','HU',
                    'Iceland','IS',
                    'India','IN',
                    'Indonesia','ID',
                    'Israel','IL',
                    'Italy','IT',
                    'Ivory Coast','CI',
                    'Jamaica','JM',
                    'Japan','JP',
                    'Jordan','JO',
                    'Kazakhstan','KZ',
                    'Kenya','KE',
                    'Kiribati','KI',
                    'Kosrae','KO',
                    'Kuwait','KW',
                    'Kyrgyzstan','KG',
                    'Laos','LA',
                    'Latvia','LV',
                    'Lebanon','LB',
                    'Lesotho','LS',
                    'Liberia','LR',
                    'Liechtenstein','LI',
                    'Lithuania','LT',
                    'Luxembourg','LU',
                    'Macau','MO',
                    'Macedonia','MK',
                    'Madagascar','MG',
                    'Madeira','ME',
                    'Malawi','MW',
                    'Malaysia','MY',
                    'Maldives','MV',
                    'Mali','ML',
                    'Malta','MT',
                    'Marshall Islands','MH',
                    'Martinique','MQ',
                    'Mauritania','MR',
                    'Mauritius','MU',
                    'Mexico','MX',
                    'Moldova','MD',
                    'Monaco','MC',
                    'Montserrat','MS',
                    'Morocco','MA',
                    'Mozambique','MZ',
                    'Myanmar','MM',
                    'Namibia','NA',
                    'Nepal','NP',
                    'Netherlands','NL',
                    'Netherlands Antilles','AN',
                    'New Caledonia','NC',
                    'New Zealand','NZ',
                    'Nicaragua','NI',
                    'Niger','NE',
                    'Nigeria','NG',
                    'Norfolk Island','NF',
                    'Northern Ireland','NB',
                    'Northern Mariana Islands','MP',
                    'Norway','NO',
                    'Oman','OM',
                    'Pakistan','PK',
                    'Palau','PW',
                    'Panama','PA',
                    'Papua New Guinea','PG',
                    'Paraguay','PY',
                    'Peru','PE',
                    'Philippines','PH',
                    'Poland','PL',
                    'Ponape','PO',
                    'Portugal','PT',
                    'Puerto Rico','PR',
                    'Qatar','QA',
                    'Republic of Ireland','IE',
                    'Republic of Yemen','YE',
                    'Reunion','RE',
                    'Romania','RO',
                    'Rota','RT',
                    'Russia','RU',
                    'Rwanda','RW',
                    'Saba','SS',
                    'Saipan','SP',
                    'Saudi Arabia','SA',
                    'Scotland','SF',
                    'Senegal','SN',
                    'Seychelles','SC',
                    'Sierra Leone','SL',
                    'Singapore','SG',
                    'Slovakia','SK',
                    'Slovenia','SI',
                    'Solomon Islands','SB',
                    'South Africa','ZA',
                    'South Korea','KR',
                    'Spain','ES',
                    'Sri Lanka','LK',
                    'St. Barthelemy','NT',
                    'St. Christopher','SW',
                    'St. Croix','SX',
                    'St. Eustatius','EU',
                    'St. John','UV',
                    'St. Kitts &amp; Nevis','KN',
                    'St. Lucia','LC',
                    'St. Maarten','MB',
                    'St. Martin','TB',
                    'St. Thomas','VL',
                    'St. Vincent &amp; the Grenadines','VC',
                    'Sudan','SD',
                    'Suriname','SR',
                    'Swaziland','SZ',
                    'Sweden','SE',
                    'Switzerland','CH',
                    'Syria','SY',
                    'Tahiti','TA',
                    'Taiwan','TW',
                    'Tajikistan','TJ',
                    'Tanzania','TZ',
                    'Thailand','TH',
                    'Tinian','TI',
                    'Togo','TG',
                    'Tonga','TO',
                    'Tortola','TL',
                    'Trinidad &amp; Tobago','TT',
                    'Truk','TU',
                    'Tunisia','TN',
                    'Turkey','TR',
                    'Turks &amp; Caicos Islands','TC',
                    'Tuvalu','TV',
                    'Uganda','UG',
                    'Ukraine','UA',
                    'Union Island','UI',
                    'United Arab Emirates','AE',
                    'United Kingdom','GB',
                    'Uruguay','UY',
                    'US Virgin Islands','VI',
                    'Uzbekistan','UZ',
                    'Vanuatu','VU',
                    'Venezuela','VE',
                    'Vietnam','VN',
                    'Virgin Gorda','VR',
                    'Wake Island','WK',
                    'Wales','WL',
                    'Wallis &amp; Futuna Islands','WF',
                    'Western Samoa','WS',
                    'Yap','YA',
                    'Yugoslavia','YU',
                    'Zaire','ZR',
                    'Zambia','ZM',
                    'Zimbabwe','ZW');

    foreach my $field ( sort ( keys %country_array ) )
    {
      $bill_countries .= qq~<option value="$country_array{$field}" $selected1{"$country_array{$field}"}>$field</option>\n~;
      $ship_countries .= qq~<option value="$country_array{$field}" $selected2{"$country_array{$field}"}>$field</option>\n~;
   }

   return($bill_countries, $ship_countries);
}

###########################################################
# Display Price
###########################################################

sub display_price
{
   my ($price) = @_;

   $price = sprintf ("%.2f", $price);
   $price = "$currency_symbol $price";

   return ($price);
}
