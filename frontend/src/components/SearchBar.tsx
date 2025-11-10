import { useState } from "react";
import { Paper, TextField, Button, Box, Select, MenuItem, FormControl, InputLabel } from "@mui/material";

type Props = {
  onSearch: (params: {
    city?: string;
    config?: "FLAT" | "SHOP" | "PLOT";
    offer?: "SELL" | "RENT";
    minCost?: number;
    maxCost?: number;
  }) => void;
};

export default function SearchBar({ onSearch }: Props) {
  const [city, setCity] = useState("");
  const [config, setConfig] = useState("");
  const [offer, setOffer] = useState("");
  const [minCost, setMinCost] = useState<string>("");
  const [maxCost, setMaxCost] = useState<string>("");

  const handleSearch = () => {
    onSearch({
      city: city || undefined,
      config: (config as any) || undefined,
      offer: (offer as any) || undefined,
      minCost: minCost ? Number(minCost) : undefined,
      maxCost: maxCost ? Number(maxCost) : undefined,
    });
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <TextField
          label="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Configuration</InputLabel>
          <Select
            value={config}
            label="Configuration"
            onChange={(e) => setConfig(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="FLAT">Flat</MenuItem>
            <MenuItem value="SHOP">Shop</MenuItem>
            <MenuItem value="PLOT">Plot</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Offer Type</InputLabel>
          <Select
            value={offer}
            label="Offer Type"
            onChange={(e) => setOffer(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="SELL">Sell</MenuItem>
            <MenuItem value="RENT">Rent</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Min Price"
          type="number"
          value={minCost}
          onChange={(e) => setMinCost(e.target.value)}
        />
        <TextField
          label="Max Price"
          type="number"
          value={maxCost}
          onChange={(e) => setMaxCost(e.target.value)}
        />
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
      </Box>
    </Paper>
  );
}
