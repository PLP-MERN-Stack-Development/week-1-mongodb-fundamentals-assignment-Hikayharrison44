// queries.js - Script to perform various MongoDB queries on the plp_bookstore database

// Import MongoDB client
const { MongoClient } = require('mongodb');

// Connection URI
const uri = 'mongodb://localhost:27017';

// Database and collection names
const dbName = 'plp_bookstore';
const collectionName = 'books';

// Function to run all queries
async function runQueries() {
    const client = new MongoClient(uri);

    try {
        // Connect to the MongoDB server
        await client.connect();
        console.log('Connected to MongoDB server for queries.');

        // Get database and collection
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        console.log('\n--- Task 1: Basic Queries ---');

        // 1. Find all books in a specific genre (e.g., 'Fiction')
        console.log('\n1. Books in "Fiction" genre:');
        const fictionBooks = await collection.find({ genre: 'Fiction' }).toArray();
        fictionBooks.forEach(book => console.log(` - "${book.title}" by ${book.author}`));

        // 2. Find books published after a certain year (e.g., 1950)
        console.log('\n2. Books published after 1950:');
        const booksAfter1950 = await collection.find({ published_year: { $gt: 1950 } }).toArray();
        booksAfter1950.forEach(book => console.log(` - "${book.title}" (${book.published_year})`));

        // 3. Find books by a specific author (e.g., 'George Orwell')
        console.log('\n3. Books by "George Orwell":');
        const georgeOrwellBooks = await collection.find({ author: 'George Orwell' }).toArray();
        georgeOrwellBooks.forEach(book => console.log(` - "${book.title}"`));

        // 4. Update the price of a specific book (e.g., '1984')
        console.log('\n4. Updating price of "1984" to 11.99...');
        const updateResult = await collection.updateOne(
            { title: '1984' },
            { $set: { price: 11.99 } }
        );
        console.log(`Matched ${updateResult.matchedCount}, Modified ${updateResult.modifiedCount} document(s).`);
        // Verify the update
        console.log('Updated "1984" book details:');
        const updatedBook = await collection.findOne({ title: '1984' });
        console.log(` - "${updatedBook.title}" price: $${updatedBook.price}`);

        // 5. Delete a book by its title (e.g., 'Moby Dick')
        console.log('\n5. Deleting "Moby Dick"...');
        const deleteResult = await collection.deleteOne({ title: 'Moby Dick' });
        console.log(`Deleted ${deleteResult.deletedCount} document(s).`);
        // Verify deletion
        console.log('Checking if "Moby Dick" exists:');
        const mobyDick = await collection.findOne({ title: 'Moby Dick' });
        console.log(mobyDick ? ' - Moby Dick still exists.' : ' - Moby Dick successfully deleted.');


        console.log('\n--- Task 3: Advanced Queries ---');

        // 1. Find books that are both in stock and published after 2010
        console.log('\n1. Books in stock and published after 2010:');
        const inStockAfter2010 = await collection.find({
            in_stock: true,
            published_year: { $gt: 2010 }
        }).toArray();
        inStockAfter2010.forEach(book => console.log(` - "${book.title}" (${book.published_year})`));

        // 2. Use projection to return only the title, author, and price fields
        console.log('\n2. All books with only title, author, and price (projection):');
        const projectedBooks = await collection.find({}, { projection: { title: 1, author: 1, price: 1, _id: 0 } }).toArray();
        projectedBooks.forEach(book => console.log(` - Title: ${book.title}, Author: ${book.author}, Price: $${book.price}`));

        // 3. Implement sorting to display books by price (ascending)
        console.log('\n3. Books sorted by price (ascending):');
        const sortedAsc = await collection.find({}, { projection: { title: 1, price: 1, _id: 0 } }).sort({ price: 1 }).toArray();
        sortedAsc.forEach(book => console.log(` - "${book.title}": $${book.price}`));

        // 3. Implement sorting to display books by price (descending)
        console.log('\n3. Books sorted by price (descending):');
        const sortedDesc = await collection.find({}, { projection: { title: 1, price: 1, _id: 0 } }).sort({ price: -1 }).toArray();
        sortedDesc.forEach(book => console.log(` - "${book.title}": $${book.price}`));

        // 4. Use the limit and skip methods to implement pagination (5 books per page)
        console.log('\n4. Pagination - Page 1 (5 books):');
        const page1 = await collection.find({}, { projection: { title: 1, _id: 0 } }).skip(0).limit(5).toArray();
        page1.forEach(book => console.log(` - ${book.title}`));

        console.log('\n4. Pagination - Page 2 (5 books):');
        const page2 = await collection.find({}, { projection: { title: 1, _id: 0 } }).skip(5).limit(5).toArray();
        page2.forEach(book => console.log(` - ${book.title}`));


        console.log('\n--- Task 4: Aggregation Pipeline ---');

        // 1. Calculate the average price of books by genre
        console.log('\n1. Average price of books by genre:');
        const avgPriceByGenre = await collection.aggregate([
            { $group: { _id: '$genre', averagePrice: { $avg: '$price' } } },
            { $sort: { _id: 1 } } // Sort by genre for readability
        ]).toArray();
        avgPriceByGenre.forEach(item => console.log(` - Genre: ${item._id}, Average Price: $${item.averagePrice.toFixed(2)}`));

        // 2. Find the author with the most books in the collection
        console.log('\n2. Author with the most books:');
        const authorWithMostBooks = await collection.aggregate([
            { $group: { _id: '$author', bookCount: { $sum: 1 } } },
            { $sort: { bookCount: -1 } },
            { $limit: 1 }
        ]).toArray();
        authorWithMostBooks.forEach(item => console.log(` - Author: ${item._id}, Books: ${item.bookCount}`));

        // 3. Implement a pipeline that groups books by publication decade and counts them
        console.log('\n3. Books grouped by publication decade:');
        const booksByDecade = await collection.aggregate([
            {
                $group: {
                    _id: {
                        $concat: [
                            { $toString: { $multiply: [{ $floor: { $divide: ['$published_year', 10] } }, 10] } },
                            's'
                        ]
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } } // Sort by decade for readability
        ]).toArray();
        booksByDecade.forEach(item => console.log(` - Decade: ${item._id}, Count: ${item.count}`));


        console.log('\n--- Task 5: Indexing ---');

        // 1. Create an index on the title field for faster searches
        console.log('\n1. Creating index on "title" field...');
        await collection.createIndex({ title: 1 });
        console.log('Index on "title" created.');

        // 2. Create a compound index on author and published_year
        console.log('\n2. Creating compound index on "author" and "published_year" fields...');
        await collection.createIndex({ author: 1, published_year: 1 });
        console.log('Compound index on "author" and "published_year" created.');

        // 3. Use the explain() method to demonstrate performance improvement
        console.log('\n3. Explaining query performance with indexes:');

        // Helper function to safely get explain plan details
        const getExplainStats = (explainResult) => {
            const stats = explainResult.executionStats;
            const winningPlan = stats?.winningPlan;
            const stage = winningPlan?.stage;
            const inputStage = winningPlan?.inputStage;
            const inputStageStage = inputStage?.stage;

            return {
                totalKeysExamined: stats?.totalKeysExamined,
                totalDocsExamined: stats?.totalDocsExamined,
                executionTimeMillis: stats?.executionTimeMillis,
                winningPlanStage: stage || inputStageStage || 'N/A' // Fallback for different structures
            };
        };

        // Explain a query using the 'title' index
        console.log('\n   Query for "1984" (using title index):');
        const explainTitleQuery = await collection.find({ title: '1984' }).explain('executionStats');
        const titleStats = getExplainStats(explainTitleQuery);
        console.log('   Execution Stats for title query:');
        console.log(`     Total Keys Examined: ${titleStats.totalKeysExamined}`);
        console.log(`     Total Docs Examined: ${titleStats.totalDocsExamined}`);
        console.log(`     Execution Time (ms): ${titleStats.executionTimeMillis}`);
        console.log(`     Winning Plan Stage: ${titleStats.winningPlanStage}`);


        // Explain a query using the compound index
        console.log('\n   Query for "George Orwell" published in 1949 (using compound index):');
        const explainCompoundQuery = await collection.find({ author: 'George Orwell', published_year: 1949 }).explain('executionStats');
        const compoundStats = getExplainStats(explainCompoundQuery);
        console.log('   Execution Stats for compound query:');
        console.log(`     Total Keys Examined: ${compoundStats.totalKeysExamined}`);
        console.log(`     Total Docs Examined: ${compoundStats.totalDocsExamined}`);
        console.log(`     Execution Time (ms): ${compoundStats.executionTimeMillis}`);
        console.log(`     Winning Plan Stage: ${compoundStats.winningPlanStage}`);

    } catch (err) {
        console.error('Error occurred during queries:', err);
    } finally {
        // Close the connection
        await client.close();
        console.log('\nConnection closed after queries.');
    }
}

// Run the function
runQueries().catch(console.error);