import React, { useState, useEffect, useRef } from "react";
import { Table, Button, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { FilterValue } from "antd/lib/table/interface";

interface Record {
  key: string;
  city_name: string;
  country_name: string;
  timezone: string;
}

interface CityData {
  records?: {
    recordid: string;
    fields: {
      name: string;
      cou_name_en: string;
      timezone: string;
    };
  }[];
  total_records: number;
}

// type SortOrder = "ascend" | "descend" | undefined;

// interface SortedInfo {
//   columnKey?: string;
//   order?: SortOrder;
// }
////
type SortOrder = "ascend" | "descend";

interface SortedInfo {
  columnKey?: string;
  order?: SortOrder | null | undefined;
}
////

const CitiesTable: React.FC = () => {
  const [cities, setCities] = useState<Record[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [loadMore, setLoadMore] = useState<boolean>(true);
  const [counter, setCounter] = useState<number>(0);
  const [sortedInfo, setSortedInfo] = useState<SortedInfo>({});

  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCities();
  }, [loadMore]);

  useEffect(() => {
    if (searchText) {
      fetchCities();
    }
  }, [searchText]);

  /////

  let uniqueCounter = 1; // Initialize a counter

  const generateUniqueKey = (cityData: {
    city_name: string;
    country_name: string;
    timezone: string;
  }) => {
    const uniqueKey = `${cityData.city_name}-${cityData.country_name}-${
      cityData.timezone
    }-${uniqueCounter++}`;
    console.log("Generated unique key:", uniqueKey); // Log the generated unique key
    return uniqueKey;
  };
  /////

  const fetchCities = async () => {
    setLoading(true);
    try {
      // Reset the uniqueCounter when fetching new cities
      uniqueCounter = 1;
      const response = await fetch(
        `https://public.opendatasoft.com/api/records/1.0/search/?dataset=geonames-all-cities-with-a-population-1000&start=${counter}&rows=10&q=${searchText}`
      );
      // const data: CityData = await response.json();
      // const newCities: Record[] =
      //   data?.records?.map((record) => ({
      //     key: record.recordid,
      //     city_name: record.fields.name,
      //     country_name: record.fields.cou_name_en,
      //     timezone: record.fields.timezone,
      //   })) ?? [];

      // const data: CityData = await response.json();
      // console.log(data);
      // const newCities: Record[] =
      //   data?.records?.map((record) => {
      //     const city: Record = {
      //       key: generateUniqueKey({
      //         city_name: record.fields.name,
      //         country_name: record.fields.cou_name_en,
      //         timezone: record.fields.timezone,
      //       }),
      //       city_name: record.fields.name,
      //       country_name: record.fields.cou_name_en,
      //       timezone: record.fields.timezone,
      //     };
      //     return city;
      //   }) ?? [];

      const data: CityData = await response.json();
      const newCities: Record[] =
        data?.records?.map((record) => ({
          key: generateUniqueKey({
            city_name: record.fields.name,
            country_name: record.fields.cou_name_en,
            timezone: record.fields.timezone,
          }),
          city_name: record.fields.name,
          country_name: record.fields.cou_name_en,
          timezone: record.fields.timezone,
        })) ?? [];

      // Filter out duplicates based on the key
      const uniqueNewCities = newCities.filter(
        (newCity) => !cities.some((city) => city.key === newCity.key)
      );

      if (counter === 0) {
        setCities(uniqueNewCities);
      } else {
        // setCities((prevCities) => [...prevCities, ...newCities]);

        setCities((prevCities) => [...prevCities, ...uniqueNewCities]);
      }
      setCounter((prevCounter) => prevCounter + uniqueNewCities.length);

      if (cities.length + uniqueNewCities.length >= data.total_records) {
        setLoadMore(false);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching cities:", error);
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    setCounter(0); // Reset counter to 0 for new fetch
    setLoadMore(true); // Reset loadMore to true for new fetch
  };

  const handleScroll = () => {
    const tableDiv = tableRef.current;
    if (tableDiv) {
      const scrollPosition = tableDiv.scrollTop + tableDiv.clientHeight;
      const scrollHeight = tableDiv.scrollHeight;

      if (scrollPosition === scrollHeight && !loading && loadMore) {
        fetchCities();
      }
    }
  };

  const handleTableChange = (
    // _pagination: any,
    // _filters: any,
    // sorter: { columnKey?: string; order?: SortOrder }
    _pagination: { current: number; pageSize: number },
    _filters: Record<string, FilterValue | null>,
    sorter: { columnKey?: string; order?: SortOrder }
  ) => {
    setSortedInfo(sorter);
    // Sort data in memory based on sorter info
    // const sortedCities = [...cities].sort((a, b) => {
    //   const key = sorter.columnKey || "";
    //   switch (key) {
    //     case "city_name":
    //     case "country_name":
    //     case "timezone":
    //       if (sorter.order === "ascend") {
    //         return a[key].localeCompare(b[key]);
    //       } else if (sorter.order === "descend") {
    //         return b[key].localeCompare(a[key]);
    //       }
    //       break;
    //     default:
    //       break;
    //   }
    //   return 0;
    // });

    const sortedCities = [...cities].sort((a, b) => {
      const key = sorter.columnKey || "";
      switch (key) {
        case "city_name":
        case "country_name":
        case "timezone":
          if (sorter.order === "ascend") {
            return (a[key] ?? "").localeCompare(b[key] ?? "");
          } else if (sorter.order === "descend") {
            return (b[key] ?? "").localeCompare(a[key] ?? "");
          }
          break;
        default:
          break;
      }
      return 0;
    });
    setCities(sortedCities);
  };

  const columns = [
    {
      title: "City Name",
      dataIndex: "city_name",
      key: "city_name",
      sorter: true,
      sortOrder:
        sortedInfo.columnKey === "city_name" ? sortedInfo.order : undefined,
      render: (text: string) => <Link to={`/city/${text}`}>{text}</Link>, // Make city names clickable links
    },
    {
      title: "Country",
      dataIndex: "country_name",
      key: "country_name",
      sorter: true,
      sortOrder:
        sortedInfo.columnKey === "country_name" ? sortedInfo.order : undefined,
    },
    {
      title: "Timezone",
      dataIndex: "timezone",
      key: "timezone",
      sorter: true,
      sortOrder:
        sortedInfo.columnKey === "timezone" ? sortedInfo.order : undefined,
    },
  ];

  return (
    <>
      <div className="input">
        <h1>Weather App</h1>
        <Input
          className="search"
          placeholder="Search cities..."
          prefix={<SearchOutlined />}
          onChange={(e) => handleSearch(e.target.value)}
          value={searchText}
          style={{ marginBottom: 16, width: 200 }}
        />
      </div>
      <div
        ref={tableRef}
        style={{ maxHeight: "calc(100vh - 64px)", overflowY: "auto" }}
        onScroll={handleScroll}
      >
        {/* <Table
          dataSource={cities}
          columns={columns}
          loading={loading}
          pagination={false}
          onChange={handleTableChange}
        /> */}
        <Table
          dataSource={cities}
          columns={columns}
          loading={loading}
          pagination={false}
          onChange={handleTableChange}
          rowKey={(record) => record.key}
        />

        {loadMore && (
          <Button
            style={{ marginTop: 16, marginLeft: 8 }}
            type="primary"
            onClick={fetchCities}
            loading={loading}
          >
            Load More
          </Button>
        )}
      </div>
    </>
  );
};

export default CitiesTable;
