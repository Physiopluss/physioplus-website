## Website Overview

It's a PhysioPlus Website which mainly does 2 things

1. Onboard physio
2. Patient can book physio.

### On Board Physio Process

1. Physio goes to Physio Conect Page, sees benefit to join with us.
2. Login using Name and Mobile Number wit Otp validation using msg91.
3. After Validating, Personal Detail Page open where he/she can fill their data, clinc and home data.
4. After submitting this, Business Detail Page open where he/she can upload images of their clinic, degree & achievemnet etc.
5. After submitting this, Work experience Page open where they can fill their expeirence, iap details
6. After submitting this, Payment page opens if they have coupon the can fill and get discount if not they can pay using razorpay.

### Booking Process

1. Patient can sign up with their details like name, mobile number, dob and validate with OTP using msg91. If they already registered they can login using Mobile number and OTP.
2. In Book Physio Page, Patient can see physios listing, their they can search according to name, city & filter physio according to service type, specialisation, subspecialisation, gender, rating, etc.
3. View Physio Name, Image, Charges, ratings upfront.
4. On click on View Details/Book to view its physio description, if they doesn't logged in they can navigate to login page and if logged in they can navigate to physio description page.
5. In Physio Description Page, Patient can see physio data, images of clinic, achievement etc.
6. If Patient satisfies with physio, can book to this page, on right side home and
7. Then view particular physio profile, see their rating, clinic images(if any), their description and their certificates.
8. If they satisfy with this particular physio they can book home or clinic visit of given date and avialable slot of that day after that they can navigate to payment and patient detail page.
9. In payment page, patient prefill data comes if patient want to change they can change particular details and verify booking date and slot and then choose payment method pay at clinic or online(razorpay)

## Technical Details

### Run Code

Start App In Development - npm run dev
And in Production - npm run build

## Github Repo - https://github.com/Physiopluss/Physioplus_Frontend

## Tech Stack -

React + JS + Vite
Material Tailwind + Tailwind CSS
React Router DOM
Redux Toolkit
React Query + Axios
Formik (for form handling)
Yup (for form validation)

## Folder Structure -

### Src -> API

In this, Apis are initialized using Axios, all api are divided into where they are implemeted

### Src -> Pages Folder

1. Pages folder in src are direct function that are render on routes via react router dom
2. These are also divided in to Flows according to Auth, Blog, Booking, PhysioConnect, etc
3. For Example, in auth it contains Login, Sign Up and Reset Password pages

### Src -> Components

1. In this folder, All the components which are used in any of the pages are stored and they also classified in folder

### Src -> slices

0. Store on state mangement are places in src folder.
1. Slices contain state management logics according to the flow.
