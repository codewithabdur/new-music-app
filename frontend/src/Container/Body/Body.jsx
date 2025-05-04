import React, { useEffect, useRef, useState } from 'react';
import oldclient from '../../lib/oldclient'
import client from '../../lib/client';
import ReactAudioPlayer from 'react-audio-player';
import { FaPlay, FaPause } from "react-icons/fa";
import { GiNextButton, GiPreviousButton  } from "react-icons/gi";
import { ImLoop } from "react-icons/im";
import { Triangle } from 'react-loader-spinner'
import disk from '../../assets/disk.png'


const Body = ({ searchQuery }) => {
  const [data, setData]= useState([]);
  const [filteredData, setFilteredData]= useState([]); // to store filtered songs
  const [audioUrl, setAudioUrl] = useState(null); // State to hold the audio URL
  const [currentImage, setCurrentImage] = useState(null); // State to hold the current image
  const audioPlayerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false); // State to manage play/pause
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLooping, setIsLooping] = useState(false); // State to manage looping
  const [duration, setDuration] = useState(0); // total duration (seconds)
  const [currentTime, setCurrentTime] = useState(0); // current time (seconds)

  useEffect(() =>{
    const fetchData = async () =>{
      const oldClientData = await oldclient.fetch(`*[_type == "podcast"]{
        title,
        subtitle,
        slug,
        description,
        copyright,
        language,
        category,
        file{
        asset->{
        url,
        },
        },
        audioimg{
        asset->{
        url,
        },
        },
        }`)
  
        const clientData = await client.fetch(
          `
      *[_type == "podcast"]{
        title,
        subtitle,
        slug,
        description,
        copyright,
        language,
        category,
        file{
          asset->{
            url,
          },
        },
        audioimg{
          asset->{
            url,
          },
        },
        category
      }
      `
        )
        const combinedData = [...oldClientData, ...clientData];
        // Set the combined data to state
        const sortedData = combinedData.sort((a, b) => {
          if (a.title && b.title) {
            return a.title.localeCompare(b.title);
          }
          return 0; // If title is not available, keep the original order
        });
    
        // Set the sorted data to state
        setData(sortedData);
        setFilteredData(sortedData);
    
        // Set the initial audio URL (if any)
        // setAudioUrl(sortedData[0]?.file?.asset?.url);
      };
    
      fetchData().catch((error) => {
        console.error("Error fetching data:", error);
      });
  },[])


  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredData(data);
    } else {
      const filtered = data.filter(item => {
        // Ensure item.category is a string before calling toLowerCase
        const category = item.category ? String(item.category) : ''; 
        return category.toLowerCase().includes(searchQuery.toLowerCase());
      });
      setFilteredData(filtered);
    }
  }, [searchQuery, data]);

  const handlePlay = (url, index, img) => {
    setAudioUrl(url);
    setCurrentIndex(index);
    setCurrentImage(img); // Set the current image
    setIsPlaying(true); // Mark it as playing
  };

  const handleAudioCanPlay = () => {
    if (audioPlayerRef.current && isPlaying) {
      audioPlayerRef.current.audioEl.current.play();
    }
  };
  

  const togglePlayPause = () => {
    
    if (audioPlayerRef.current) {
      const audio = audioPlayerRef.current.audioEl.current;
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < filteredData.length) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setAudioUrl(filteredData[nextIndex]?.file?.asset?.url);
      setCurrentImage(filteredData[nextIndex]?.audioimg?.asset?.url); // Set the next image
      setIsPlaying(true);
    } else {
      // If last song, start from the beginning
      setCurrentIndex(0);
      setAudioUrl(filteredData[0]?.file?.asset?.url);
      setCurrentImage(filteredData[0]?.audioimg?.asset?.url); // Set the first image
      setIsPlaying(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex - 1 >= 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setAudioUrl(filteredData[prevIndex]?.file?.asset?.url);
      setCurrentImage(filteredData[prevIndex]?.audioimg?.asset?.url); // Set the previous image
      setIsPlaying(true);
    }
  };

  const handleLoop = () => {
    if (audioPlayerRef.current) {
      const audio = audioPlayerRef.current.audioEl.current;
      audio.loop = !audio.loop; // Toggle loop ON/OFF
      setIsLooping(audio.loop);
    }
  };

  const handleTimeUpdate = () => {
    if (audioPlayerRef.current) {
      const audio = audioPlayerRef.current.audioEl.current;
      setCurrentTime(audio.currentTime); // Update current time
    }
  };

  const handleSeek = (e) => {
    const seekTime = Number(e.target.value);
    if (audioPlayerRef.current) {
      const audio = audioPlayerRef.current.audioEl.current;
      audio.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60) || 0;
    const seconds = Math.floor(time % 60) || 0;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
 
  return (
    <div className="p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">

      {filteredData.length === 0 && (
        <div className="loader flex justify-center items-center h-[60vh] w-screen">
        <Triangle
        visible={true}
        height="100"
        width="100"
        color="#2f3f78"
        ariaLabel="triangle-loading"
        wrapperStyle={{}}
        wrapperClass=""
        />
        </div>
      )}

<ReactAudioPlayer
            src={audioUrl}
            controls
            ref={audioPlayerRef}
            className="hidden"
            onCanPlay={handleAudioCanPlay}
            onLoadedMetadata={() => {
              if (audioPlayerRef.current) {
                const audio = audioPlayerRef.current.audioEl.current;
                setDuration(audio.duration); // Set total duration when metadata is loaded
              }
            }}
            onListen={handleTimeUpdate}
            listenInterval={1000}
            onEnded={() => {
              if (isLooping) {
                // If looping is ON, replay the same song
                if (audioPlayerRef.current) {
                  const audio = audioPlayerRef.current.audioEl.current;
                  audio.currentTime = 0;
                  audio.play();
                }
              } else {
                handleNext(); // Otherwise, play the next song
              }
            }}
      />
      {filteredData.map((item, index) => (
        <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300" onClick={() => handlePlay(item.file?.asset?.url, index, item.audioimg?.asset?.url)}>
          <span className='box cursor-pointer'>
          <img src={item.audioimg?.asset?.url} alt={item.title} className="w-full h-[200px] object-cover" />
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
            <p className="text-gray-600 text-sm">
              {item.description.substring(0, 200)}...
            </p>
          </div>
          </span>
        </div>
      ))}

<div className="fixed bottom-0 left-0 right-0 bg-[#111] h-[15vh] ">
        <div className="w-[100vw] flex justify-center items-center">
        
          <GiPreviousButton className="text-white text-2xl m-4 cursor-pointer" onClick={handlePrev} />
          {isPlaying ? (
            <FaPause className="text-white text-2xl m-4 cursor-pointer" onClick={togglePlayPause} />
          ) : (
            <FaPlay className="text-white text-2xl m-4 cursor-pointer" onClick={togglePlayPause} />
          )}
          <ImLoop className={` ${isLooping ? "text-[#26ff8f]" : "text-[#fff]"} text-2xl m-4 cursor-pointer`} onClick={handleLoop} />
          
          <GiNextButton className="text-white text-2xl m-4 cursor-pointer" onClick={handleNext} />
          <img
            src={currentImage || disk}
            className={`w-[2rem] aspect-square ml-2 object-cover rounded-full ${isPlaying ? "animate-spin" : ""}`}
          />
        
        </div>
        <div className="flex items-center justify-between px-4 ">
  <span className="text-white text-xs">{formatTime(currentTime)}</span>
  <input
    type="range"
    min="0"
    max={duration}
    value={currentTime}
    onChange={handleSeek}
    className="w-full mx-2 h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer"
  />
  <span className="text-white text-xs">{formatTime(duration)}</span>
</div>
      </div>
    </div>
  );
};

export default Body;
