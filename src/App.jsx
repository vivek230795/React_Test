import { useState, useEffect, useRef } from 'react'
import {LazyLoadImage} from 'react-lazy-load-image-component';
import './App.css'


function App() {
  const IMAGE_BASE_URL = 'https://test.create.diagnal.com/images/';
  const API_BASE_URL = 'https://test.create.diagnal.com/data/page';

  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);

  const inputRef = useRef(null); // Create a ref for the input box


  useEffect(() => {
    if (hasMorePages) {
      fetchData(currentPage);
    }

    // Event listener for scrolling
    window.addEventListener('scroll', handleScroll);

    // Cleanup the event listener on component unmount
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage, hasMorePages]);

  const fetchData = (page) => {
    fetch(`${API_BASE_URL}${page}.json`)
      .then((response) => {
        if (!response.ok) {
          setHasMorePages(false); // No more pages to fetch
          return null;
        }
        return response.json();
      })
      .then((newData) => {
        if (newData) {
          setData((prevData) => [
            ...prevData,
            ...newData?.page?.['content-items'].content,
          ]);
        }
      })
      .catch((error) => console.error('Error Fetching the Data.', error));
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 10
    ) {
      if (hasMorePages) {
        setCurrentPage((prevPage) => prevPage + 1);
      }
    }
  };

  const filteredData =
    data.length > 0 &&
    data.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  return (
    <div className="app">
      {/* The Header Section */}
      <header className="header">
        <div className='header-container'>
          <img src="https://test.create.diagnal.com/images/Back.png" alt="Back" />
          <span>Romantic Comedy</span>
        </div>
        <div className="search-container"> 
        {/* <img src="https://test.create.diagnal.com/images/nav_bar.png" alt="Search Icon" className="search-icon" /> */}
          <input
            ref={inputRef} // Attach the ref to the input box
            className='input-box'
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />
          <img onClick={() => focusInput()} className='search-img' src="https://test.create.diagnal.com/images/search.png" alt="search" />


        </div>
     
      </header>

      {/* The Image Section with title */}
      <div className="scrollable">
        <div className="grid">
            {filteredData &&
              filteredData.map((item, index) => (
                <div key={index} className="grid-item">
                  <LazyLoadImage
                    src={`${IMAGE_BASE_URL}${item['poster-image']}`}
                    alt={item.name}
                    effect="blur"
                    className="thumbnail"
                  />
                  <p className='title'>{item.name}</p>
                </div>
            ))}
        </div>
      </div>
      {
        filteredData.length === 0 && <p> No Match Found...!</p>
      }
    </div>
  );
}

export default App;