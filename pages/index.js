import Head from 'next/head';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faSun,faMoon } from '@fortawesome/free-regular-svg-icons';
import { useTheme } from 'next-themes';
import CountdownTimer from '../components/CountdownTimer';

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
  const start = new Date(StartDate);
  const end = new Date(EndDate);
  const days_between = Math.round((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
  return(days_between);
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
	<div className="w-full">
	  <button className="float-right text-xl lg:text-2xl">
	  { theme === "light" ? (
	    <FontAwesomeIcon icon={faSun} onClick={() => setTheme('dark')}/>
	  ):(
	    <FontAwesomeIcon icon={faMoon} onClick={() => setTheme('light')}/>
	  )}
	  </button>
	</div>
        <h1 className="title text-center m-0 text-5xl md:text-6xl lg:text-7xl">
          whenfestival?
        </h1>

        <div className="grid">
	  {FestivalData.map(({ id, name, url, start, end, country, address, flag, maps, image, image_black }) => (
            <a href={url} className="card max-w-2xl">
	      <div className="inline-block align-middle pr-2 lg:pr-0 py-4 lg:py-0 w-3/12 text-center">
		<Image
		  src={image}
		  width={130}
		  height={130}
		  style={
	            theme === "dark" && image_black ?
		      {filter:"invert(100%)"}
		    :
		      {filter:"none"}
	          }
		      
		/>
	      </div>
	      <div className="inline-block align-middle lg:pl-2 py-2 w-9/12">
		<CountdownTimer targetDate={start} className="float-right font-mono"/>
		<div>
		  <p className="float-left text-xs sm:text-sm"> {country} &nbsp; {flag} </p>
	          <p className="clear-left font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl">{name}</p>
		</div>
	        <p className="text-xs md:text-base lg:text-lg">
	          {parseDate(start)} - {parseDate(end)}
		  <br/>
        	  {daysBetween(start,end) === 0 ?
		    daysBetween(start,end) + 1 + ' day':
		    daysBetween(start,end) + 1 + ' days'
		  } long
		  <br/>
		  {address}&nbsp;(
	          <a
		    className="inline underline"
		    href={maps}
		    target="_blank"
		  >
	            Maps
		  </a>
	          )
		</p>
	      </div>
	    </a>
	  ))}
        </div>
      </main>

      <footer>
	<p className="text-sm md:text-base px-4">
	  made with love by delfino for paul.
	</p>
	<p className="text-sm md:text-base">
	  checkout&nbsp;
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
