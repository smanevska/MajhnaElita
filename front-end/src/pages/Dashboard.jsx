import Menu from "../components/Menu";
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

const wishlist=[ 
  {name:"Books", price:"€15", tag:"Sale"},
  {name:"Baby girl dress", price:"€15", tag:"Sale"},
  {name:"Princess costume", price:"€22", tag:"Sale"},
  {name:"Kids books", price:"Free", tag:"Donation"}
];

export default function Dashboard(){
  return(
    <div className="app-shell">
      <Menu />

      <div className="main-area">
        <div className="topbar">
          <input className="search" placeholder="Search" />
          <div className="actions">
            <button className="icon-btn">🛒</button>
            <button className="icon-btn">🔔</button>
            <button className="add-btn">+ Add New Item</button>
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
          <h3>My wishlist</h3>
          <div className="wishlist-grid">
            {wishlist.map((item) => (
              <div className="wishlist-card" key={item.name}>
                <div className="thumb">
                  <div className="heart">♡</div>
                </div>
                <div className="info">
                  <span>{item.name}</span>
                  <span>{item.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}