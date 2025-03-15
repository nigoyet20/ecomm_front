import './CircleLoader.scss'

function CircleLoader({ black }: { black?: boolean }) {

  return (
    <div className="loader">
      <div className={black ? "bar bar-black bar1" : "bar bar1"}></div>
      <div className={black ? "bar bar-black bar2" : "bar bar2"}></div>
      <div className={black ? "bar bar-black bar3" : "bar bar3"}></div>
      <div className={black ? "bar bar-black bar4" : "bar bar4"}></div>
      <div className={black ? "bar bar-black bar5" : "bar bar5"}></div>
      <div className={black ? "bar bar-black bar6" : "bar bar6"}></div>
      <div className={black ? "bar bar-black bar7" : "bar bar7"}></div>
      <div className={black ? "bar bar-black bar8" : "bar bar8"}></div>
      <div className={black ? "bar bar-black bar9" : "bar bar9"}></div>
      <div className={black ? "bar bar-black bar10" : "bar bar10"}></div>
      <div className={black ? "bar bar-black bar11" : "bar bar11"}></div>
      <div className={black ? "bar bar-black bar12" : "bar bar12"}></div>
    </div>
  )
}

export default CircleLoader;
