# Chat-Website

My focus on this project was on the website backend. 
My idea was to implement a user authentication system. Where the user can sign up using an email and password which would be encrypted and stored.
Once the user logged on with this same information the encryption would verify the logon information against the stored details and once verified, the user would be taken to the chat page.
I had planned to implement cookies to prevent the user logging in every time they refreshed, this cookie could also be used to prevent automatic access if the user entered the chat url.
However, due to encryption implementation issues the other features weren't included.

I did also plan to use the users email and the chatID, which would of been stored in the cookie. But again time.

Unfortunately most of my time was spent on the hashing function, I had originally planned to use Scrypt but after several days of trying to implement it, I noticed in the documentation it was deprecated.
After some tinkering with other hashing libraries I decided to go with Argon2, which was easy to implement. 

When the user signs up, the data is posted to the backend in plaintext, which isn't ideal. But once received a function is called to hash the email and password and store this data in a text file.

When the user logs in, the details are again posted to the backend where a function uses fs to grab the file and compare all the hashes against the hash of the entered details from the user.

At the start of the project I had an issue where express wasn't able to capture the post requests sending the data as json, converting the data to string seemed to solve the issue.

These things took a lot longer than originally anticipated, especially debugging. In a server environment I thought it was best to read and write data to the users text file asynchronously in a buffer however,
I couldn't figure out the best way to get return values from a callback function, even using promises. So again not ideal, I stuck with synchronous code for read and write.

Once I had the main focus of the backend working, I turned to the front end with limited time. I tend to prefer bootstrap, as it makes doing complex things in HTML very simple.
In order to adhere to the assessment criteria, the bootstrap elements were changed with custom css.

In terms of design, its very basic. I wished to do more, but time wouldn't allow it. I enjoy using 'custom' fonts, I prefer lato.
I make small adjustments to the spacing, weight, and padding as I find more pleasant to read.

I had hoped to use a custom border around the areas of text, almost like a small bubble. But I kept having issues with getting the placement of the border using css border.
I then tried to use background/origin but it wouldn't allow for rounded ages, so returned back to css border. 

I also added a bootstrap nav bar, which makes navigation much more convenient.

I definitely learned a lot from this project, especially the importance of reading documentation, and knowing when to give up when things aren’t working.
