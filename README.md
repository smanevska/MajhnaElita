# Kids Wardrobe Exchange System
(Project for Systems III)

## Problem statement

Parents face the challenge of managing their children's outgrown, unused clothes and items. As children grow quickly, they outgrow their clothes, toys, and other essentials, leading to an accumulation of unused items. This causes messy spaces and makes it hard to organize or reuse these belongings. At the same time, there are limited platforms specifically designed for buying, selling, or renting children’s items. Most online marketplaces are too general and full of unrelated items, making it difficult for parents to find what they need for their kids. These platforms also rarely offer convenient ways to rent items, which could be useful for temporary needs such as special occasions.

This problem arises within households where parents are constantly purchasing new items for their children, while old items pile up and remain unused. The lack of organization and proper storage can create cluttered living spaces, making it hard for families to manage their belongings efficiently. Parents may also struggle to decide whether to sell, donate, or throw away items, which adds to the daily stress of managing a busy household.

Parents and caregivers are the primary groups affected by this issue. They often face a financial burden from continuously buying new clothes and essentials for their children. Families also experience frustration and stress from dealing with the excess of unused items. Low-income families are also affected, as they have limited budgets and need affordable ways to get or share children’s clothes and toys. In addition children are also affected because their outgrown clothes and toys may sit unused, get damaged, or be hard to find when needed, so they don’t benefit fully from the items they already have. Overall, multiple perspectives show that this problem affects both the household budget and daily life management.

The context for addressing this problem is creating a specialized system where parents can buy, sell, rent, or donate children’s clothes and other essentials. Such a platform would provide a structured way to manage outgrown items, making it easier to exchange or share them within a community. By including features such as donation points, in-app chat, and secure transaction management, the system can help families save money, reduce waste, and better organize their children’s belongings. The scope is limited to children’s items, focusing on clothing, toys, and other essential goods.

## Functional and nonfunctional requirements of new system

## Functional requirements

The system should enable the following functionalities:

1. Account and Profile Management
• Users should be able to create, edit, and manage their personal profiles.
• Profiles include: name, surname, email, phone, optional profile picture, donating points.
• Users can view their own profile information.

2. Item Posting and Managing
• Users can post items for sale, rent, or donation.
• Include item details: title, category (clothes, toys, gear etc.), size, condition, age, price/rent.
• Upload photo per item.
• Option to mark items as available for rent, sale, or donation.
• When listing items for rent, sellers should be able to define available dates using a calendar view.

3. Search and Filtering
• Users should be able to search for items using keywords, categories.
• Filters based on size, age group, and price range or condition.
• The system should display results in a list or grid format with thumbnail images.

4. Donation System
• Users can donate items for free.
• Donors earn points, top donors will receive recognition.
• The system maintains a history of donations and points earned.

5. Wishlist
• Users can mark items as favorites or add them to wishlist. Later can view saved items.

6. Communication
• In-app chat, so users can directly message each other.
• Users can negotiate prices, clarify product details, method of delivery(pick up in person, home delivery, courier service).
• The system should notify users of new messages.

7. Transactions
• Users can buy, rent, or donate items directly on the platform. 
• Transaction records include: item details, price, sender, receiver, payment method, and date. 
• Users can view their transaction history. 
• Sellers can track sales and rentals via a dashboard.

8. Notification System
• Users receive notifications for important events: 
• New messages or chat activity. 
• Purchases, rentals, or donations. 
• Rental start and return reminders. 
• System updates or promotions.

9. Rating System
• After a transaction (sale, rent, or donation), users can rate the other user. 
• Ratings are numeric (e.g., 1–5 stars) and optional text feedback can be added. 
• Users’ profiles display average ratings. 

## Non-functional requirements

1. Performance
• The system should handle up to 1000 active users without slowing down. 
• Search results and images should load quickly (within 3 seconds). 
• Chat messages should be delivered in real-time. 
• User actions (listing items, transactions, calendar updates) should respond within 5 seconds.

2. Information
• All item, user, and transaction information must be up-to-date. 
• Users should always see the correct availability status of items. 
• Integrations (e.g., email notifications, payment gateways) must provide accurate updates.

3. Control and Security
• User data must be encrypted (SSL/TLS) during storage and transmission. 
• Sensitive information (email, phone) is shared only with user consent. 
• Regular backups must be performed to prevent data loss, retaining data for at least 12 months.

4. Service
• The app should be accessible on Web, from any location.
• Ensure 99% uptime, with maintenance communicated to users. The app should recover from failures.
• Provide clear user guides, FAQs, and in-app support for users.

5. Efficiency
• The app should have a consistent and responsive UI across all devices. The interface should include tooltips, labels, and icons for better navigation.
• Listing, searching, and exchanging items should be simple and quick. Users should be able to post items with minimal required information.

## Links

Kids Wardrobe Exchange System - Wireframe Diagram:
https://www.figma.com/design/F1wm76yIO33kInWmZ6OWbw/Majhna-Elita?node-id=0-1&p=f&t=9QBg5j5diJYcmoi4-0

Logical Design - Data modelling - Entity relationship diagram (ERD):
https://www.figma.com/board/o8CJ5b39qhKvRUfCZ3TDBp/Seminar-ERD?node-id=0-1&t=zY5lVFe5mmH94wEO-1

Relational model:
https://www.figma.com/board/m6vAMhn8UaWZdzclmCKALo/Seminar-RM?node-id=0-1&t=Kj0Tnc6n3G7PEpQe-1
