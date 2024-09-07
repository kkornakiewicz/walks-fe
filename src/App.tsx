import { useDispatch } from "react-redux"
import "./App.css"
import KeplerGl from "@kepler.gl/components"
import { useEffect, useState } from "react"
import { addDataToMap } from "@kepler.gl/actions"

async function httpGet(url: string) {
  const data = await fetch(url, {})
  return await data.json()
}

const sampleTripData = {
  fields: [
    {
      name: "tpep_pickup_datetime",
      format: "YYYY-M-D H:m:s",
      type: "timestamp",
    },
    { name: "pickup_longitude", format: "", type: "real" },
    { name: "pickup_latitude", format: "", type: "real" },
  ],
  rows: [
    ["2015-01-15 19:05:39 +00:00", -73.99389648, 40.75011063],
    ["2015-01-15 19:05:39 +00:00", -73.97642517, 40.73981094],
    ["2015-01-15 19:05:40 +00:00", -73.96870422, 40.75424576],
  ],
}

const DATA_URL = "http://ey.mm.st/edges.json"

export default function App() {
  const dispatch = useDispatch()
  const [data, setData] = useState()

  const fetchData = async () => {
    setData([])
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    data &&
      dispatch(
        addDataToMap({
          datasets: {
            info: {
              label: "RECENT EARTHQUAKES IN TURKEY AND ITS ENVIRONMENT",
              id: "EARTHQUAKES",
            },
            data: data,
          },
          options: {
            centerMap: false,
            readOnly: true,
          },
          config: {
            mapStyle: { styleType: "light" },
            mapState: {
              latitude: 52.253971373306165,
              longitude: -2.6899063817571394,
              zoom: 6.655984704565685,
              isSplit: false,
            },
          },
        })
      )
  }, [dispatch, data])

  return (
    <KeplerGl
      id="map"
      width={window.innerWidth}
      height={window.innerHeight}
      mapboxApiAccessToken=""
    />
  )
}
