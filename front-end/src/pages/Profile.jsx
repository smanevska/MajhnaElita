import { useEffect, useState, useRef } from "react";
import Menu from "../components/Menu";
import { authFetch, API_URL } from "../api/api";


export default function Profile() {
    const [user, setUser] = useState({
        first_name: "",
        last_name: "",
        email: "",
        location: "",
        profile_picture: "",
        points: 0
    });

    const [items, setItems] = useState([]);
    const [openMenu, setOpenMenu] = useState(null);
    const [rating, setRating] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [wishlist,setWishlist]=useState([]);
    
    const listingRef = useRef();
    const donationRef = useRef();
    const reviewRef = useRef();
    const wishlistRef = useRef();

    useEffect(() => {
        async function loadProfile() {
            try {
                //get user information
                const userResponse = await authFetch("/users/me");
                const userData = await userResponse.json();
                if (userData.success) {
                    setUser(userData.user);
                }
                //get user's items
                const itemsResponse = await authFetch("/items/my");
                const itemsData = await itemsResponse.json();
                if (itemsData.success) {
                    setItems(itemsData.items);
                }
                const reviewsResponse =await authFetch(`/reviews/user/${userData.user.id}`);
                const reviewsData = await reviewsResponse.json();
                if (reviewsData.success) {
                    setReviews(reviewsData.reviews);
                    const avg =reviewsData.reviews.length ? (reviewsData.reviews.reduce((sum, r) => sum + r.rating, 0 ) / reviewsData.reviews.length ).toFixed(1) : 0;
                    setRating(avg);
                }
                const wishlistResponse=await authFetch(`/wishlist/user/${userData.user.id}`);
                const wishlistData=await wishlistResponse.json();
                if(wishlistData.success){
                    setWishlist(wishlistData.wishlist);
                }
            }catch (error) {
                console.log("Profile loading error:", error);
            }
        }
        loadProfile();
    }, []);

    function imageUrl(path) {
        if (!path) {
            return "/profile.png";  
        }
        return `${API_URL}/${path}`;
    }

    //delete item card function
    async function deleteMyItem(id) {
        const confirmDelete = window.confirm("Do you want to delete this item?")
        if (!confirmDelete) return;
        const response = await authFetch(
            `/items/${id}`,
            { method: "DELETE" }
        );
        const data = await response.json();
        if (data.success) {
            const itemsResponse = await authFetch("/items/my");
            const itemsData = await itemsResponse.json();
            if (itemsData.success) {
                setItems(itemsData.items);
            }
            const userResponse = await authFetch("/users/me");
            const userData = await userResponse.json();
            if (userData.success) {
                setUser(userData.user);
            }
        }
    }

    function ItemCard({ item, donation = false, myItem = false }) {
        return (
            <div className="profile-item-card">
                <img src={imageUrl(item.image)} alt={item.title} />
                <div className="item-info">
                    <h3>{item.title} </h3>
                    {
                        item.status === "sold" &&
                        <span className="sold-label">  Sold</span>
                    }

                    {donation
                            ?
                            <span className="donation-label"> Donation </span>
                            :
                            <div>
                                <p> {Number(item.item_type_id) === 2
                                    ?
                                    `€${item.item_price}/day`
                                    :
                                    `€${item.item_price}`}
                                </p>
                                {Number(item.item_type_id) === 2 && item.rental_start && item.rental_end && (<small> Available:<br />  {formatDate(item.rental_start)} - {formatDate(item.rental_end)} </small>
                                )}
                            </div>
                    }
                    {myItem && (
                        <div className="item-actions">
                            <button
                                className="menu-button"
                                onClick={() =>
                                    setOpenMenu(
                                        openMenu === item.id ? null : item.id  ) } > ⋮</button>
                            {openMenu === item.id && (
                                <div className="action-menu">
                                    {item.status !== "sold" && (
                                     <button onClick={() => changeStatus(item.id)} > Mark as sold </button>
                                    )}
                                    <button onClick={() => deleteMyItem(item.id)}>Delete </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    const listings = items.filter(
        item => Number(item.item_type_id) !== 3);
    const donations = items.filter(
        item => Number(item.item_type_id) === 3);


    function formatDate(date) {
        if (!date) return "";
    return new Date(date).toLocaleDateString("en-CA");
}

    async function changeStatus(id) {
        const response = await authFetch(
            `/items/${id}/sold`,
            {
                method: "PUT"
            }
        );
        const data = await response.json();
        if (data.success) {
            const itemsResponse=await authFetch("/items/my");
            const itemsData =await itemsResponse.json();
            setItems(itemsData.items);
            setOpenMenu(null);
        }
    }

return (
    <div className="app-shell">
        <Menu />
        <div className="main-area">
            <div className="profile-page">
                {/* Profile Header */}
                <div className="profile-card">
                    <img
                        className="profile-avatar"
                        src={
                        user.profile_picture
                        ? `${API_URL}/${user.profile_picture}`
                        : "/profile.png"} />

                    <h2>{user.first_name} {user.last_name}</h2>
                    <p>📧 {user.email}</p>
                    <p>📍 {(!user.location || user.location === "null") ? "No location added" : user.location}</p>
                    <div className="profile-stats">
                        <div>
                            ⭐{rating}
                            <br />
                            Rating
                        </div>
                        <div>
                            🎁
                            <br />
                            {user.points} Points
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="profile-tabs">
                    <button onClick={() => listingRef.current.scrollIntoView({ behavior: "smooth" })}>
                        Listings
                    </button>

                    <button onClick={() => donationRef.current.scrollIntoView({ behavior: "smooth" })}>
                        Donations
                    </button>

                    <button onClick={() => reviewRef.current.scrollIntoView({ behavior: "smooth" })}>
                        Reviews
                    </button>

                    <button onClick={() => wishlistRef.current.scrollIntoView({ behavior: "smooth" })}>
                        Wishlist
                    </button>
                </div>

                {/* Listings */}
                <section ref={listingRef}>
                    <h2>My Listings</h2>

                    <div className="profile-items-grid">
                        {listings.length > 0 ? (
                            listings.map(item => (
                                <ItemCard
                                    key={item.id}
                                    item={item}
                                    myItem={true} />
                            ))
                        ) : (
                            <div className="empty">No listings yet</div>
                        )}
                    </div>
                </section>

                {/*Donations */}
                <section ref={donationRef}>
                    <h2>Donations</h2>
                    <div className="profile-items-grid">
                        {donations.length > 0 ? (
                            donations.map(item => (
                                <ItemCard
                                    key={item.id}
                                    item={item}
                                    donation={true}
                                    myItem={true}
                                />
                            ))
                        ) : (
                            <div className="empty">No donations yet</div>
                        )}
                    </div>
                </section>

                {/* Reviews*/}
                <section ref={reviewRef}>
                    <h2>Reviews</h2>
                    {
                        reviews.length > 0 ?
                            reviews.map(review => (
                                <div className="review-card" key={review.id}>
                                    <h4> {"⭐".repeat(review.rating)} </h4>
                                    <p> {review.comment} </p>
                                    <small> Item: {review.title} </small>
                                    <small>  By: {review.first_name} {review.last_name}</small>
                                </div>
                            ))
                            :
                            <div className="empty">
                                No reviews yet
                            </div>
                    }
                </section>

                {/* Wishlist */}
                <section ref={wishlistRef}>
                    <h2>Wishlist</h2>
                    <div className="profile-items-grid">
                        {
                            wishlist.length > 0 ? wishlist.map(item => (
                                    <ItemCard key={item.id} item={item} />
                                ))
                                :
                                <div className="empty"> No wishlist yet </div>
                        }
                    </div>
                </section>

            </div>
        </div>
    </div>
);}