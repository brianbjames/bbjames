#######################################################################################
# Configuration
#######################################################################################

# Change this to something that no one could ever guess. This is used to create
# your special key for your pages so that we can insure that no one has tampered with
# the dollar amounts.

$encrypt_key        = 'something!hard2guess';

# Enter the taxable state code. If the person ordering enters that same state code for
# their ship to state then they will be charged sales tax. If they do not enter a ship
# to state then it will use the bill to state.

$taxable_state      = 'WA';

# State tax rate.

$taxable_rate       = '.086';

# This is the default country that will show in the drop down on the orders form. Just
# enter the 2 letter code in UPPER CASE.

$default_country = 'US';

# List the credit cards here that you accept and this will automatically update the orderform.

@credit_cards       = ('Visa','MasterCard','Discover','American Express');

# Email address were the orders will be emailed to, and the customer confiramtion email
# will come from.

$admin_email        = 'order@example.com';

# This is the URL to the folder were all of your product pages are located. This is used
# allong with the page=name.htm in the code for the Continue Shopping button in the cart.
# Do not put a trailing slash at the end.

$html_prd_pages     = 'http://www.yourdomain.com/HTML-CART';

# Enter the path to your template file. This is a standard Dreamweaver template with an
# editable region named {DATA}. Everything above {DATA} will be printed at the top, and
# everything after that will be printed at the bottom of the script data.

$template_file      = './MAIN.dwt';

# Secure path to the html-cart.cgi script.

# $secure_url = 'https://secure/path/to/cgi-bin/html-cart.cgi';
$secure_url = 'http:/.yourdomain.com/HTML-CART/html-cart.cgi';

# Change this to the secure path to the order.cgi script!
# DO NOT use a non secure path to view orders because a hacker could capture
# that information and view your customers credit card information.

# $secure_order_url = 'https://secure/url/to/cgi-bin/admin/orders.cgi';
$secure_order_url = 'http:/.yourdomain.com/HTML-CART/admin/orders.cgi';

# Domain name for cookie:
# You need to have 2 dots in the domain name for it to work properly
# $domain_name_for_cookie = '.yourdomain.com';
$domain_name_for_cookie = '.yourdomain.com';

# The path is every thing after your domain name
# $path_for_cookie = '/';
$path_for_cookie = '/';

# Currency symbol to be displayed in cart.
$currency_symbol = '$';

1;