import { useParams } from "react-router";
import { useEffect, useState, useRef } from "react";
import Menu from "../components/Menu";
import { authFetch, API_URL } from "../api/api";


export default function UserProfile() {
    const { id } = useParams();
    const [user, setUser] = useState({
        first_name: "",
        last_name: "",
        email:"",
        location:"",
        profile_picture:"",
        points: 0  });
        

    const [items, setItems] = useState([]);

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


    function ItemCard({ item, donation = false}) {
        return (
            <div className="profile-item-card">
                <img
                    src={imageUrl(item.image)}
                    alt={item.title}
                />
                <div className="item-info">

                    <h3>
                        {item.title}
                    </h3>

                    {
                        donation
                            ?
                            <span className="donation-label">
                                 Donation
                            </span>
                            :
                            <p>
                                {
                                    item.item_type_id === 2
                                        ?
                                        `€${item.item_price}/day`
                                        :
                                        `€${item.item_price}`
                                }
                            </p>
                    }
                    </div>
            </div>
  ); }
    const listings = items.filter(
        item => Number(item.item_type_id) !== 3
    );
    const donations = items.filter(
        item => Number(item.item_type_id) === 3
    );

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
                            ⭐
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
                                    item={item}
                                />
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
                    <div className="empty">No reviews yet</div>
                </section>
            </div>
        </div>
    </div>
);}