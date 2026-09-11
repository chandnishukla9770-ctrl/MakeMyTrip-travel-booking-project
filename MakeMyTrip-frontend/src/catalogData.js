const image = (photo) => `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=900&q=80`;

export const demoDestinations = [
    { id: 6, name: "Jaipur", description: "Royal palaces, colourful markets and unforgettable Rajasthani culture.", image: image("photo-1599661046289-e31897846e41") },
    { id: 7, name: "Kerala", description: "Cruise through peaceful backwaters, tea gardens and lush green hills.", image: image("photo-1602216056096-3b40cc0c9944") },
    { id: 8, name: "Ladakh", description: "Discover high mountain passes, clear skies and dramatic Himalayan landscapes.", image: image("photo-1548013146-72479768bada") },
    { id: 9, name: "Rishikesh", description: "A refreshing escape for river rafting, yoga and riverside adventures.", image: image("photo-1595815771614-ade9d652a65d") },
    { id: 10, name: "Andaman", description: "Relax on turquoise beaches and explore beautiful island life.", image: image("photo-1582967788606-a171c1080cb0") },
];

export const demoHotels = [
    { id: 6, name: "Pink City Palace", description: "A comfortable stay close to Jaipur's historic old city.", location: "Jaipur, Rajasthan", price_per_night: "2850.00", rating: "4.3", image: image("photo-1599661046289-e31897846e41"), destinations: 6 },
    { id: 7, name: "Backwater Breeze", description: "Peaceful rooms with warm hospitality and scenic water views.", location: "Alleppey, Kerala", price_per_night: "3200.00", rating: "4.6", image: image("photo-1602216056096-3b40cc0c9944"), destinations: 7 },
    { id: 8, name: "Mountain Base Camp", description: "A cosy base for exploring Ladakh's spectacular mountain roads.", location: "Leh, Ladakh", price_per_night: "4100.00", rating: "4.5", image: image("photo-1510798831971-661eb04b3739"), destinations: 8 },
    { id: 9, name: "Ganga Riverside Stay", description: "A calm riverside stay near cafes, temples and adventure spots.", location: "Rishikesh, Uttarakhand", price_per_night: "2450.00", rating: "4.2", image: image("photo-1595815771614-ade9d652a65d"), destinations: 9 },
    { id: 10, name: "Island Palm Retreat", description: "Bright rooms, island views and easy access to the beach.", location: "Port Blair, Andaman", price_per_night: "4600.00", rating: "4.7", image: image("photo-1582967788606-a171c1080cb0"), destinations: 10 },
];

export const demoPackages = [
    { id: 6, name: "Jaipur royal trail", description: "Explore forts, palaces, local food and the colourful heart of Jaipur.", duration: "3 days / 2 nights", price: "9800.00", destination: 6 },
    { id: 7, name: "Kerala backwater escape", description: "Enjoy a relaxed houseboat stay, tea gardens and beautiful coastal views.", duration: "5 days / 4 nights", price: "18500.00", destination: 7 },
    { id: 8, name: "Ladakh high pass adventure", description: "Ride through stunning valleys, monasteries and unforgettable mountain passes.", duration: "6 days / 5 nights", price: "24900.00", destination: 8 },
    { id: 9, name: "Rishikesh adventure break", description: "Mix riverside relaxation with rafting, local experiences and yoga.", duration: "3 days / 2 nights", price: "8900.00", destination: 9 },
    { id: 10, name: "Andaman island holiday", description: "Spend sunny days island hopping, snorkelling and relaxing by the sea.", duration: "5 days / 4 nights", price: "21900.00", destination: 10 },
];

export const withDemoRecords = (records, demoRecords) => {
    const existingIds = new Set(records.map((record) => record.id));
    return [...records, ...demoRecords.filter((record) => !existingIds.has(record.id))];
};
