import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import Logo from "../assets/site-logo-nobg.png";
import Banner from "../assets/gray-background.jpg";

gsap.registerPlugin(ScrollTrigger);


const API_URL = 'https://suitmedia-backend.suitdev.com/api/ideas';

function About() {
  const bannerRef = useRef(null);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState('-published_at');
  const [totalItems, setTotalItems] = useState(0);

  // Header hide/show logic
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setShowHeader(currentScroll < lastScrollY.current || currentScroll < 10);
      lastScrollY.current = currentScroll;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(API_URL, {
        params: {
          'page[number]': page,
          'page[size]': pageSize,
          append: ['small_image', 'medium_image'],
          sort,
        },
      });
      setPosts(response.data.data);
      setTotalItems(response.data.meta.total);
    };
    fetchData();
  }, [page, pageSize, sort]);

  useEffect(() => {
    if (bannerRef.current) {
      gsap.to(bannerRef.current, {
        yPercent: 20,
        ease: 'power1.out',
        scrollTrigger: {
          trigger: bannerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }
  }, []);

    const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(startItem + pageSize - 1, totalItems);
  const totalPages = Math.ceil(totalItems / pageSize);

  const handlePageClick = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const renderPagination = () => {
    const pageNumbers = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);

    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex justify-center mt-6 space-x-2">
        <button
          onClick={() => handlePageClick(1)}
          className="px-2 py-1 "
        >
          {'<<'}
        </button>
        <button
          onClick={() => handlePageClick(page - 1)}
          className="px-2 py-1 "
        >
          {'<'}
        </button>
        {pageNumbers.map((p) => (
          <button
            key={p}
            onClick={() => handlePageClick(p)}
            className={`px-3 py-1  ${page === p ? 'bg-orange-500 text-white' : ''}`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => handlePageClick(page + 1)}
          className="px-2 py-1 "
        >
          {'>'}
        </button>
        <button
          onClick={() => handlePageClick(totalPages)}
          className="px-2 py-1 "
        >
          {'>>'}
        </button>
      </div>
    );
  };

  return (
    <div className='min-h-screen pb-12'>
      <header className={`fixed top-0 w-full bg-orange-500 transition-all duration-500 ${showHeader ? 'bg-orange-500 bg-opacity-70' : '-translate-y-full'}`}>
        <nav className="flex justify-around items-center p-4">
          <NavLink to="/"><img src={Logo} alt="logo" /></NavLink>
          <div className="space-x-6 text-white overflow-hidden max-sm:hidden max-md:hidden">
            <NavLink to="/work" className="nav-link hover:border-b-4 border-b-white">Work</NavLink>
            <NavLink to="/about" className="nav-link der-b-4 border-b-white">Aboout</NavLink>
            <NavLink to="/services" className="nav-link der-b-4 border-b-white">Services</NavLink>
            <NavLink to="/ideas" className="nav-link der-b-4 border-b-white">Ideas</NavLink>
            <NavLink to="/careers" className="nav-link der-b-4 border-b-white">Careers</NavLink>
            <NavLink to="/contact" className="nav-link der-b-4 border-b-white">Contact</NavLink>
          </div>
        </nav>
      </header>

      <section className="relative overflow-hidden h-[460px] -z-1" ref={bannerRef}>
        <img src={Banner} alt="banner" className="absolute w-full h-full object-cover brightness-50" />
        <div className="relative z-20 flex justify-center items-center h-full">
          <div className="text-center">
            <h1 className="text-white text-5xl font-reguler">Ideas</h1>
            <h2 className="text-white text-xl mt-1 font-light">Where all our great things begin</h2>
          </div>
        </div>
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 100 10">
          <polygon fill="white" points="0,10 100,0 100,100" />
        </svg>
      </section>

      <section className="p-6 max-w-6xl mx-auto mt-14">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-600">
            Showing {page} - {pageSize}  of {totalItems}
          </div>
          <div className='flex gap-5'>
            <div>
              Show per page:
              <select value={pageSize} onChange={e => setPageSize(+e.target.value)} className="ml-2 w-24 border border-gray-400 rounded-full px-2 py-1">
                {[10, 20, 50].map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
            <div>
              Sort by:
              <select value={sort} onChange={e => setSort(e.target.value)} className="ml-2 w-24 border border-gray-400 rounded-full px-2 py-1">
                <option value="-published_at">Newest</option>
                <option value="published_at">Latest</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {posts.map((post, index) => (
            <a
              key={index}
              href={`${API_URL}/${post.id}?append[]=small_image&append[]=medium_image`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl shadow-md p-3 block hover:shadow-lg transition"
            >
              <img
                src={post.small_image}
                loading="lazy"
                alt={post.title}
                className="w-full h-40 object-cover rounded"
              />
              <p className="text-xs text-gray-500 mt-2">
                {new Date(post.published_at).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
              <h3 className="mt-1 font-semibold line-clamp-3 min-h-[4.5rem]">{post.title}</h3>
            </a>
          ))}
        </div>

        {renderPagination()}
      </section>
    </div>
  );
}

export default About;
