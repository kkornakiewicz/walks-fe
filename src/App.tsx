import { useDispatch } from "react-redux"
import "./App.css"
import KeplerGl from "@kepler.gl/components"
import { useEffect, useState } from "react"
import { addDataToMap } from "@kepler.gl/actions";

async function httpGet(url: string) {
  const data = await fetch(url, {})
  return await data.json()
}

const DATA_URL = "http://ey.mm.st/edges.json"

const sampleConfig = {
  visState: {
    filters: [
      {
        id: "dateFilter_id",
        dataId: "date_id",
        name: "", //the name of the column to be filtered
        type: "timeRange", //filter type to be use
      },
    ],
  },
}

export default function App() {
  const dispatch = useDispatch()
  const [data, setData] = useState()

  const fetchData = async () => {
    setData(await httpGet(DATA_URL))
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
            centerMap: true,
            readOnly: false,
          },
          config: { mapStyle: {styleType: 'light'}}
        }),
      )
  }, [dispatch, data])

  return (
    <KeplerGl
      id="map"
      width={window.innerWidth}
      height={window.innerHeight}
      mapboxApiAccessToken="Your Mapbox Access Token "
    />
  )
}
