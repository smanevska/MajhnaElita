import { useEffect,useState} from "react";
import Menu from "../components/Menu";
import {useNavigate} from "react-router";
import { authFetch,apiFetch ,API_URL} from "../api/api";

export default function Dashboard(){
const navigate = useNavigate();
const [items,setItems]=useState([]);
const [currentUser,setCurrentUser]=useState(null);
const [leaderboard, setLeaderboard] = useState([]);
const [wishlist,setWishlist]=useState([]);
//Converts database date format into a readable date format
function formatDate(date) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-CA");
}
const stats=[
  {icon:"📦", value:items.length, label:"Active Items"},
  {icon:"⏱", value:"0", label:"Active Rentals"},
  { icon:"🏅",value:currentUser?.points || 0,label:"Donation Points"}
];
// Fetches logged-in user's profile data
useEffect(() => {
  async function getUser(){
    const response = await authFetch("/users/me");
    const data = await response.json();
    if(data.success){
      setCurrentUser(data.user);
    }
  }
  getUser();
}, []);

//Loads all available published items from the backend
useEffect(()=>{
  async function getPublishedItems(){
    try{
      const response=await apiFetch("/items");
      const data= await response.json();
      if (data.success){
        setItems(data.items);
      }
    }catch(error){
      console.log("Error in loading items: ",error);
    }
  }
  getPublishedItems();
},[]);

// Fetches the top donors from the backend
useEffect(() => {
    async function getLeaderboard(){
        try{
            const response = await apiFetch("/users/leaderboard");
            const data = await response.json();
            if(data.success){
                setLeaderboard(data.users);
            }
        }catch(error){
            console.log("Leaderboard error:", error);
        }
    }
    getLeaderboard();
}, []);


useEffect(() => {
  const refreshUser = async () => {
    const response = await authFetch("/users/me");
    const data = await response.json();
    if(data.success){
      setCurrentUser(data.user);
    }
  };
  window.addEventListener("focus", refreshUser);
  return () => {
    window.removeEventListener("focus", refreshUser);
  };
}, []);
async function getMyWishlist(){
    const response = await authFetch(
        "/wishlist/my");
    const data = await response.json();
    if(data.success){
        return data.wishlist.map(item=>item.id);
    }
    return [];
}

  useEffect(() => {
    async function loadWishlist() {
      const ids = await getMyWishlist();
      setWishlist(ids);
    }
    loadWishlist();
  }, []);
// Adds or removes an item from the user's wishlist
  async function toggleWishlist(itemId) {
    const response = await authFetch(
      "/wishlist/toggle",
      {
        method: "POST",
        body: JSON.stringify({
          item_id: itemId
        })
      }
    );
    const data = await response.json();
    if (data.success) {
      const wishlistResponse = await authFetch("/wishlist/my");
      const wishlistData = await wishlistResponse.json();
      if (wishlistData.success) {
        setWishlist(
          wishlistData.wishlist.map(item => item.id)
        );
      }
    }
  }

  return(
    <div className="app-shell">
      <Menu />

      <div className="main-area">
        <div className="topbar">
          <input className="search" placeholder="Search" />
          <div className="actions">
            <button className="icon-btn">🔔</button>
            <button className="add-btn" onClick={()=>navigate("/add-item")} >+ Add New Item </button>
          </div>
        </div>

        <div className="cards">
          {stats.map((s) => (
            <div className="card" key={s.label}>
              <div className="icon">{s.icon}</div>
              <h2>{s.value}</h2>
              <p>{s.label}</p>
            </div>
          ))}
        </div>

        <div className="panel">
          <h3>Top donors leaderboard</h3>
          {leaderboard.map((row, i) => (
            <div className="leaderboard-row" key={row.id} onClick={( )=> navigate(`/user-profile/${row.id}`)}>
              <span className="rank">{i + 1}</span>
              <img src={row.profile_picture ? `${API_URL}/${row.profile_picture}` : "/profile.png"}alt="" />
              <span className="name">
                {row.first_name} {row.last_name}
                <span className="tag">Top Donor</span>
              </span>
              <span className="pts">{row.points} points</span>
            </div>
          ))}
        </div>

        <div className="panel">
          <h3>Published Items</h3>
          <div className="profile-items-grid"> 
            {items.length>0 ? items.map(item=>(
              <div className="profile-item-card" key={item.id} 
                  onClick={() => {
                            if(currentUser && currentUser.id === item.user_id){
                            navigate("/profile");
                            } else{
                                navigate(`/user-profile/${item.user_id}`);
                          }}}>
              <img src={`${API_URL}/${item.image}`}alt={item.title}/>
                <button
                  className={
                    wishlist.includes(item.id)
                      ?
                      "wishlist-btn saved"
                      :
                      "wishlist-btn"
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(item.id);
                  }} >
                  {
                    wishlist.includes(item.id) ? "❤️": "🤍" 
                  }</button>
              <div className="item-info">
                <h3>{item.title}</h3>
                {Number(item.item_type_id) === 3 ?
                  <span className="donation-label">Donation</span>
                  :
                    Number(item.item_type_id) === 2
                  ?
                  <>
                  <p>€{item.item_price}/day</p>
                  {item.rental_start && item.rental_end && (
                <small> Available: <br/> {formatDate(item.rental_start)}{" - "}{formatDate(item.rental_end)}</small>)}
                </>
                :
                <p>€{item.item_price}</p>
              }     
                </div>
            </div>))
            :
            <div className="empty"> No published items yet </div>}
          </div>
        </div>

      </div>
    </div>
  );
}