MongoDB Sample Scripts This repository contains two Node.js scripts for interacting with a local MongoDB instance:

insert_books.js: Populates a MongoDB database with sample book data.

queries.js: Demonstrates various MongoDB queries, aggregations, and indexing operations on the populated data.

Prerequisites Before running these scripts, ensure you have the following installed on your machine:

MongoDB Community Server: The database server itself.

Download MongoDB Community Server

Ensure the MongoDB service is running (you can check this in your system's Services manager on Windows, or via sudo systemctl status mongod on Linux, or brew services list on macOS if installed via Homebrew).

Node.js: A JavaScript runtime environment.

Download Node.js (LTS version recommended)

Verify installation by running node -v in your terminal.

npm (Node Package Manager): Comes bundled with Node.js.

Verify installation by running npm -v in your terminal.

MongoDB for VS Code Extension (Optional but Recommended): For easily viewing and managing your MongoDB data directly within VS Code.

Search for "MongoDB for VS Code" in the VS Code Extensions marketplace and install it.

Setup Create a Project Folder: Create a new, empty folder on your computer (e.g., mongodb_project).

Save the Scripts: Save both insert_books.js and queries.js into this mongodb_project folder.

Open Terminal/Command Prompt: Navigate your terminal or command prompt into the mongodb_project folder.

cd path/to/your/mongodb_project

(Replace path/to/your/mongodb_project with the actual path to your folder.)

Install Node.js Dependencies: From within your mongodb_project folder, run the following command to install the MongoDB Node.js driver:

npm install mongodb

This will create a node_modules folder and a package-lock.json file in your project directory.

How to Run the Scripts

Run insert_books.js This script will connect to your local MongoDB instance (mongodb://localhost:27017), create a database named plp_bookstore (if it doesn't exist), create a collection named books (dropping it first if it contains existing documents), and then insert 12 sample book documents.
To run it:

node insert_books.js

You should see output indicating successful connection, insertion count, and a list of the inserted books.

Run queries.js This script will perform a series of MongoDB operations, including:
Basic find queries (by genre, year, author).

An updateOne operation to change a book's price.

A deleteOne operation to remove a book.

Advanced queries using $gt (greater than), projection, sorting (ascending/descending), and pagination (limit, skip).

Aggregation pipelines to calculate average price by genre, find the author with the most books, and group books by publication decade.

Indexing operations (createIndex) and demonstrating their performance using explain().

To run it:

node queries.js

Observe the output in your terminal. It will show the results of each query, the changes made, and the execution statistics for the indexed queries.

Note: If you encounter any issues, ensure your MongoDB server is running and that you have installed all prerequisites correctly.
