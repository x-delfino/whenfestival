import Head from 'next/head'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { faSun,faMoon } from '@fortawesome/free-regular-svg-icons'
import { useTheme } from 'next-themes'

const CosmosClient = require("@azure/cosmos").CosmosClient;
const config = require("../config");


Home.getInitialProps = async function() {
  const { endpoint, key, databaseId, containerId } = config;
  const client = new CosmosClient({ endpoint, key });
  const database = client.database(databaseId);
  const container = database.container(containerId);
  try {
    console.log(`querying festivals`);
    const querySpec = {
      query: "SELECT * from c ORDER BY c.start" 
    };
    
    const { resources: items } = await container.items
      .query(querySpec)
      .fetchAll();
    return { FestivalData: items };
    
    items.forEach(item => {
      console.log(`${item.id} - ${item.description}`);
    });
  } catch (err) {
    console.log(err.message);
  }
}

export function parseDate(DateVar) {
  const date = new Date(DateVar);
  return(date.toDateString()); 
}

function daysBetween(StartDate, EndDate) {
  var start = new Date(StartDate);
  var end = new Date(EndDate);
  return (Math.round((end.getTime() - start.getTime()) / (1000 * 3600 * 24)));
}


export default function Home({ FestivalData }) {
  const [mounted, setMounted] = useState(false)
  var {theme, setTheme, systemTheme} = useTheme()
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  } 
  if (theme === 'system') {
    theme = systemTheme
  }
  return (
    <div className="container max-w-full">
      <Head>
        <title>whenfestival?</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
	  <button className="left-0 w-full text-right text-xl lg:text-2xl">
	  { theme === "light" ? (
	    <FontAwesomeIcon icon={faSun} onClick={() => setTheme('dark')}/>
	  ):(
	    <FontAwesomeIcon icon={faMoon} onClick={() => setTheme('light')}/>
	  )}
	  </button>
        <h1 className="title text-center m-0 text-5xl md:text-6xl lg:text-7xl">
          whenfestival?
        </h1>

        <div className="grid">
	  {FestivalData.map(({ id, name, url, start, end, country, address, flag, maps, image, image_black }) => (
            <a href={url} className="card max-w-2xl">
	      <div className="inline-block align-middle py-4 w-3/12 text-center">
		<Image
		  src={image}
		  width={120}
		  height={120}
		  style={
	            theme === "dark" && image_black ?
		      {filter:"invert(100%)"}
		    :
		      {filter:"none"}
	          }
		      
		/>
		<br/>
                <p className="text-xs md:text-base">
		  in {daysBetween(Date.now(),start)} days
		</p>
	      </div>
	      <div className="inline-block align-middle p-2 w-9/12">
		<p className="float-right text-xs sm:text-sm md:text-lg lg:text-xl"> {country} &nbsp; {flag} </p>
	        <p className="font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl">{name}</p>
	        <p className="text-xs md:text-base lg:text-lg">
	          {parseDate(start)} - {parseDate(end)}
		  <br/>
        	  {daysBetween(start,end) + 1} day/s long
		  <br/>
		  {address}&nbsp;
	          <a
		    className="inline underline"
		    href={maps}
		    target="_blank"
		  >
	            (Maps)
		  </a>
		</p>
	      </div>
	    </a>
	  ))}
        </div>
      </main>

      <footer>
	<p className="text-sm md:text-base px-4">
	  made with love by delfino for paul. checkout&nbsp;
          <a
            href="https://github.com/x-delfino/whenfestival"
            target="_blank"
            rel="noopener noreferrer"
          >
            the code repo&nbsp;
            <FontAwesomeIcon icon={faGithub} />
          </a>
	</p>
      </footer>
    </div>
  )
}
