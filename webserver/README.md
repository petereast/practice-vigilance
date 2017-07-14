# webserver
## Summary
The high level overview of this system is as follows:
- connect to database
- provide interface for this database
- determine and maintain permissions structure

## Components
The main module uses the following bespoke submodules:
- page_security.js
  - This manages allowing and denying users access to pages
- session_handler.js
  - This manages and maintains the http session cookie attached to each incoming request
- user_management.js
  - This is used to query the user database, to get user roles and other permissions
  - This could possibly be implemented as middleware, attaching the user's information to the req object.
