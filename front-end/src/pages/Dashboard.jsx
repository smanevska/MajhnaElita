import { useEffect,useState} from "react";
import Menu from "../components/Menu";
import {useNavigate} from "react-router";
import { authFetch } from "../api/api";

export default function Dashboard(){
const navigate = useNavigate();
const [items,setItems]=useState([]);
const [currentUser,setCurrentUser]=useState(null);
const [leaderboard, setLeaderboard] = useState([]);
function formatDate(date) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-CA");
}
const stats=[
  {icon:"📦", value:items.length, label:"Active Items"},
  {icon:"⏱", value:"0", label:"Active Rentals"},
  { icon:"🏅",value:currentUser?.points || 0,label:"Donation Points"}
];

  useEffect(() => {
  async function getUser(){
    const token = localStorage.getItem("token");
    const response = await fetch(
      "http://88.200.63.148:30170/users/me",
      {
        headers:{
          Authorization:`Bearer ${token}`
        }
      }
    );
    const data = await response.json();
    if(data.success){
    setCurrentUser(data.user); }
  }
  getUser();
}, []);


useEffect(()=>{
  async function getPublishedItems(){
    try{
      const response=await fetch("http://88.200.63.148:30170/items");
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


useEffect(() => {
    async function getLeaderboard(){
        try{
            const response = await fetch(
                "http://88.200.63.148:30170/users/leaderboard"
            );
            const data = await response.json();
            if(data.success){
                setLeaderboard(data.users);
            }
        }catch(error){
            console.log("Leaderboard error:", error);
        }
    }
    getLeaderboard();
}, [currentUser]);


useEffect(() => {
  const refreshUser = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      "http://88.200.63.148:30170/users/me",
      {
        headers:{
          Authorization:`Bearer ${token}`
        }
      }
    );
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


async function addToWishlist(itemId) {
    const response = await authFetch( "/wishlist",
        {
            method: "POST",
            body: JSON.stringify({
                item_id: itemId
            })
        }
    );
    const data = await response.json();
    if (data.success) {
        console.log("Added item to wishlist!");
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
              <img src={row.profile_picture ? `http://88.200.63.148:30170/${row.profile_picture}` : "/profile.png"}alt="" />
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
              <img src={`http://88.200.63.148:30170/${item.image}`}alt={item.title}/>
              <button className="wishlist-btn" onClick={(e) => {e.stopPropagation();addToWishlist(item.id);}}> ❤️</button>
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