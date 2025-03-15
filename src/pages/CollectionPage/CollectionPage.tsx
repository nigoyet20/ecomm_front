import './CollectionPage.scss'
import { useNavigate, useParams } from 'react-router-dom';
import Collection from '../../components/App/Collection/Collection';
import ToggleSwitch from "../../components/App/ToggleSwitch/ToggleSwitch";
import { VscSettings } from "react-icons/vsc";
import ModalCollectionFilter from "../../components/Modal/ModalCollectionFilter/ModalCollectionFilter";
import { useEffect, useState, FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { ProductI } from "../../@types/product";
import { actionCheckProduct } from "../../store/thunks/checkProduct";
import { setIsOpen, setFilterValue, toggleIsOpen } from "../../store/reducer/modal";
import PriceSelector from "../../components/App/PriceSelector/PriceSelector";
import { MdOutlineKeyboardArrowUp } from "react-icons/md";

function CollectionPage() {
  const { brand } = useParams<string>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [brandList, setBrandList] = useState<ProductI[]>([]);
  const [filteredList, setFilteredList] = useState<ProductI[]>([]);
  const list = useAppSelector((state) => state.product.list);
  const [priceSectionIsopen, setPriceSectionIsOpen] = useState(false);

  const available = useAppSelector((state) => state.ModalMenu.modalCollectionFilter.available);
  const modalCollectionFilterIsOpen = useAppSelector((state) => state.ModalMenu.modals.modalCollectionFilterIsOpen);
  const minPrice = useAppSelector((state) => state.ModalMenu.modalCollectionFilter.minVal);
  const maxPrice = useAppSelector((state) => state.ModalMenu.modalCollectionFilter.maxVal);
  const selectedMinPrice = useAppSelector((state) => state.ModalMenu.modalCollectionFilter.selectedMinPrice);
  const selectedMaxPrice = useAppSelector((state) => state.ModalMenu.modalCollectionFilter.selectedMaxPrice);
  const filtered = useAppSelector((state) => state.ModalMenu.modalCollectionFilter.filtered);

  useEffect(() => {
    if (list.length === 0) {
      dispatch(actionCheckProduct());
    }
  }, [dispatch, list.length]);

  useEffect(() => {
    switch (brand) {
      case 'iPhone':
        setBrandList(list.filter((product) => product.brand === 'iPhone'));
        dispatch(setFilterValue({ name: "filtered", value: false }));
        break;
      case 'Samsung':
        setBrandList(list.filter((product) => product.brand === 'Samsung'));
        dispatch(setFilterValue({ name: "filtered", value: false }));
        break;
    }
    setFilteredList(brandList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brand, list, brandList.length]);

  useEffect(() => {
    if (filtered) {
      const brandListFiltered = brandList.filter((product) => product.Prices.some((price) => +price.price >= selectedMinPrice && +price.price <= selectedMaxPrice));
      setFilteredList(brandListFiltered);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered, selectedMinPrice, selectedMaxPrice]);

  useEffect(() => {
    const initGlobalPrice = () => {
      let priceList;
      if (brandList.length === 0)
        priceList = list.map((product) => product.Prices);
      else priceList = brandList.map((product) => product.Prices);

      const minGlobalPrice = priceList.map((product) => {
        const priceList = product.map((price) => +price.price);
        let price = priceList[0];
        priceList.forEach(product => {
          if (product < price) {
            price = product;
          }
        });
        if (product) return price;
      });

      const maxGlobalPrice = priceList.map((product) => {
        const priceList = product.map((price) => +price.price);
        let price = priceList[0];
        priceList.forEach(product => {
          if (product > price) {
            price = product;
          }
        });

        if (product) return price;
      });

      if (maxGlobalPrice.length === 0 || minGlobalPrice.length === 0) return;
      dispatch(setFilterValue({ name: "minVal", value: Math.min(...minGlobalPrice.filter((price): price is number => price !== undefined)) }));
      dispatch(setFilterValue({ name: "sliderMinValue", value: Math.min(...minGlobalPrice.filter((price): price is number => price !== undefined)) }));
      dispatch(setFilterValue({ name: "minInput", value: Math.min(...minGlobalPrice.filter((price): price is number => price !== undefined)).toString() }));
      dispatch(setFilterValue({ name: "maxVal", value: Math.max(...maxGlobalPrice.filter((price): price is number => price !== undefined)) }));
      dispatch(setFilterValue({ name: "sliderMaxValue", value: Math.max(...maxGlobalPrice.filter((price): price is number => price !== undefined)) }));
      dispatch(setFilterValue({ name: "maxInput", value: Math.max(...maxGlobalPrice.filter((price): price is number => price !== undefined)).toString() }));

    }
    if (!filtered)
      initGlobalPrice();
  }, [brandList, list]);

  if (!brand) {
    navigate('/');
    return null;
  }

  const toggleAvailable = () => {
    dispatch(setFilterValue({ name: "available", value: !available }));
  };

  const handlePriceSectionClick = () => {
    setPriceSectionIsOpen(!priceSectionIsopen)
  };

  const acceptFunction = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(setFilterValue({ name: "filtered", value: true }));
    dispatch(setFilterValue({ name: "selectedMinPrice", value: minPrice }));
    dispatch(setFilterValue({ name: "selectedMaxPrice", value: maxPrice }));
    dispatch(setIsOpen({ modal: 'modalCollectionFilterIsOpen', value: false }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpen = () => {
    dispatch(toggleIsOpen('modalCollectionFilterIsOpen'));
  };

  return (
    <div className="collectionPage">
      <h3 className="collectionPage_title">{brand}</h3>
      <div className="collectionPage_container">
        <div className="collectionPage_container_filter">
          <h3 className="collectionPage_container_filter_title"><VscSettings size={20} /> Filtres</h3>
          <div className="collectionPage_container_filter_available">
            <span className="collectionPage_container_filter_available_text">En stock uniquement</span>
            <ToggleSwitch value={available} toggleValue={toggleAvailable} />
          </div>

          <div className={priceSectionIsopen ? "collectionPage_container_filter_price collectionPage_container_filter_price-open" : "collectionPage_container_filter_price"}>
            <div className="collectionPage_container_filter_price_container">
              <span className="collectionPage_container_filter_price_container_text">Prix</span>
              <div className={priceSectionIsopen ? "collectionPage_container_filter_price_container_icon collectionPage_container_filter_price_container_icon-open" : "collectionPage_container_filter_price_container_icon"} onClick={handlePriceSectionClick}>
                <MdOutlineKeyboardArrowUp size={25} />
              </div>
            </div>
            <PriceSelector isOpen={priceSectionIsopen} min={minPrice} max={maxPrice} direct={true} />
          </div>
        </div>
        <div className="collectionPage_container_collection">
          <Collection list={filteredList} numberPerRow={3} />
        </div>
      </div>

      <button className="collectionPage_filterButton" onClick={handleOpen}><VscSettings size={20} />Filtrer et trier</button>
      <ModalCollectionFilter isOpen={modalCollectionFilterIsOpen} acceptFunction={acceptFunction} cancelFunction={handleOpen} min={minPrice} max={maxPrice} />
    </div>
  )
}

export default CollectionPage;
