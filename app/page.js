import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div>
      <h1>Project Name</h1>
      <a href="/news">News</a>
      <a href="/bus-schedule"><br></br>Bus Shedules</a>
      <a href="/seat-reservation"><br></br>Seat Reservation</a>
      <a href="/shuttle-tickets"><br></br>Ticket Price</a>
      <a href="/lost&Found"><br></br>Lost & Found</a>
      <a href="/contactInformation"><br></br> Campus Security Contact</a>
      <a href="/aboutUs"><br></br> About Us</a>
    </div>
  );
}
