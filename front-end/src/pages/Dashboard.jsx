import { useEffect,useState} from "react";
import Menu from "../components/Menu";
import {useNavigate} from "react-router";
//Hardcoded data
const stats=[
  {icon:"📦", value:"12", label:"Active Items"},
  {icon:"€", value:"€264", label:"Total Sales"},
  {icon:"⏱", value:"3", label:"Active Rentals"},
  {icon:"🏅", value:"380", label:"Donation Points"}
];

const leaderboard=[
  {name:"Sara Manevska", tag:"Top Donor", pts:"1250 pts"},
  {name:"James Katen", tag:"Community", pts:"980 pts"},
  {name:"Michael Richmond", tag:"Helper", pts:"870 pts"}
];

export default function Dashboard(){
const navigate = useNavigate();
const [items,setItems]=useState([]);
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
    console.log("CURRENT USER:", data);
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

  return(
    <div className="app-shell">
      <Menu />

      <div className="main-area">
        <div className="topbar">
          <input className="search" placeholder="Search" />
          <div className="actions">
            <button className="icon-btn">🛒</button>
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
            <div className="leaderboard-row" key={row.name}>
              <span className="rank">{i + 1}</span>
              <img alt="" />
              <span className="name">
                {row.name}
                <span className="tag">{row.tag}</span>
              </span>
              <span className="pts">{row.pts}</span>
            </div>
          ))}
        </div>

        <div className="panel">
          <h3>Published Items</h3>
          <div className="profile-items-grid"> 
            {items.length>0 ? items.map(item=>(<div className="profile-item-card" key={item.id}>
              <img src={`http://88.200.63.148:30170/${item.image}`}alt={item.title}/>
              <div className="item-info">
                <h3>{item.title}</h3>
                {Number(item.item_type_id)===3 ? <span className="donation-label">Donation</span> : <p>€{item.item_price}</p>}
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