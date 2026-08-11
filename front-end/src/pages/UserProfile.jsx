import {useParams} from "react-router";
import { useEffect, useState, useRef} from "react";
import Menu from "../components/Menu";
import { authFetch, API_URL } from "../api/api";

export default function UserProfile() {
    const {id} = useParams();   //gets parameters from the url
    const [user, setUser] = useState({
        first_name: "",
        last_name: "",
        email:"",
        location:"",
        profile_picture:"",
        points: 0  });

    const [items, setItems] = useState([]);
    const [reviews,setReviews]=useState([]);
    const [rating,setRating]=useState(0);
    const [reviewItem,setReviewItem]=useState(null);
    const [newRating,setNewRating]=useState(0);
    const [comment,setComment]=useState("");
    
    const listingRef = useRef();
    const donationRef = useRef();
    const reviewRef = useRef();

    useEffect(() => {
        async function loadProfile() {
            try {
                //get user information
                const userResponse = await fetch(`${API_URL}/users/${id}`);
                const userData = await userResponse.json();
                if (userData.success) {
                    setUser(userData.user);
                }
                //get user's items
                const itemsResponse = await fetch(`${API_URL}/items/user/${id}`);
                const itemsData = await itemsResponse.json();
                if (itemsData.success) {
                    setItems(itemsData.items);
                }
                const reviewsResponse =
                await fetch(`${API_URL}/reviews/user/${id}`);
                 const reviewsData =
                await reviewsResponse.json();
                if(reviewsData.success){
                    setReviews(reviewsData.reviews);
                    const avg = reviewsData.reviews.length > 0 ? (reviewsData.reviews.reduce( (sum, r) => sum + r.rating, 0 )/ reviewsData.reviews.length ).toFixed(1) : 0;
                    setRating(avg); 
                }  
            } catch (error) {
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

    function ItemCard({ item, donation = false }) {
        return (
            <div className="profile-item-card">
                <img src={imageUrl(item.image)} alt={item.title} />
                <div className="item-info">
                    <h3> {item.title} </h3>
                    {
                        item.status === "sold" &&
                        <span className="sold-label">Sold  </span>
                    }
                    {
                        item.status === "sold" &&
                        <button
                            className="review-btn"
                            onClick={() => setReviewItem(item)} >Leave Review  </button>
                    }
                    { donation
                            ?
                            <span className="donation-label">
                                Donation
                            </span>
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
                </div>
            </div>
        );
    }
    const listings = items.filter(
        item => Number(item.item_type_id) !== 3
    );
    const donations = items.filter(
        item => Number(item.item_type_id) === 3
    );

    function formatDate(date) {
        if (!date) return "";
        return new Date(date).toLocaleDateString("en-CA");
    }

    async function submitReview() {
        const response=await authFetch(
            "/reviews",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    rating: newRating,
                    comment: comment,
                    item_id: reviewItem.id
                })
            }
        );
        const data = await response.json();
        if (data.success) {
            const response = await fetch(`${API_URL}/reviews/user/${id}`);
            const result = await response.json();
            if (result.success) {
                setReviews(result.reviews);
                const avg =
                    result.reviews.length > 0
                        ? ( result.reviews.reduce((sum, r) => sum + r.rating, 0) / result.reviews.length).toFixed(1)
                        : 0;
                setRating(avg);
            }
            setReviewItem(null);
            setComment("");
            setNewRating(0);
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
                    <p>📍 {user.location || "No location added"}</p>

                    <div className="profile-stats">
                        <div>
                            ⭐{rating || "0"}
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

                </div>

                {/* Listings */}
                <section ref={listingRef}>
                    <h2>Listings</h2>

                    <div className="profile-items-grid">
                        {listings.length > 0 ? (
                            listings.map(item => (
                                <ItemCard
                                    key={item.id}
                                    item={item} />
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
                                    donation={true} />
                            ))
                        ) : (
                            <div className="empty">No donations yet</div>
                        )}
                    </div>
                </section>

                {/* Reviews*/}
                <section ref={reviewRef}>
                    <h2>Reviews</h2>
                    <div className="reviews">
                        {
                            reviews.length > 0 ?
                                reviews.map(review => (
                                    <div className="review-card" key={review.id}>
                                    <h4> {"⭐".repeat(review.rating)} </h4>
                                        <p> {review.comment} </p>
                                        <p> Reviewed by: {review.first_name} {review.last_name}</p>
                                        <small>  Item: {review.title}</small>
                                    </div>
                                ))
                                :
                                <div className="empty"> No reviews yet</div>
                        }
                    </div>
                </section>
                    { reviewItem && (
                            <div className="review-modal">
                                <h3> Review {reviewItem.title} </h3>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Write your review"  />
                                <div className="rating-buttons">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            className={newRating >= star ? "selected-star" : ""}
                                            onClick={() => setNewRating(star)} >
                                            ⭐
                                        </button>
                                    ))}
                                </div>
                                <button onClick={submitReview}> Submit Review </button>
                                <button
                                    onClick={() => {
                                        setReviewItem(null);
                                        setComment("");
                                        setNewRating(0);
                                    }} > Cancel </button>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
}