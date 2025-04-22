import React, { useState } from "react";
import { Search, User, Calendar, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { PhoneInput } from "./PhoneInput";
import { collection, getDocs, query, where, or, db } from "../utils/firebase";
import { toast } from "sonner";

export interface PatientSearchResult {
  id: string;
  name: string;
  mrn: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
}

interface Props {
  onPatientSelect: (patient: PatientSearchResult) => void;
}

export const PatientSearch: React.FC<Props> = ({ onPatientSelect }) => {
  const [searchType, setSearchType] = useState<string>("mrn");
  const [mrnSearch, setMrnSearch] = useState<string>("");
  const [nameSearch, setNameSearch] = useState<string>("");
  const [dobSearch, setDobSearch] = useState<Date | undefined>(undefined);
  const [phoneSearch, setPhoneSearch] = useState<string>("");
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<PatientSearchResult[]>([]);

  // Function to handle search based on the active search type
  const handleSearch = async () => {
    setIsSearching(true);
    setSearchResults([]);

    try {
      // Get the search criteria based on active tab
      let searchCriteria: any = {};
      
      switch (searchType) {
        case "mrn":
          if (!mrnSearch.trim()) {
            toast.error("Please enter an MRN");
            setIsSearching(false);
            return;
          }
          searchCriteria = { mrn: mrnSearch.trim() };
          break;
          
        case "name":
          if (!nameSearch.trim()) {
            toast.error("Please enter a name");
            setIsSearching(false);
            return;
          }
          searchCriteria = { fullName: nameSearch.trim().toLowerCase() };
          break;
          
        case "dob":
          if (!dobSearch) {
            toast.error("Please select a date of birth");
            setIsSearching(false);
            return;
          }
          searchCriteria = { dateOfBirth: format(dobSearch, 'yyyy-MM-dd') };
          break;
          
        case "phone":
          if (!phoneSearch.trim()) {
            toast.error("Please enter a phone number");
            setIsSearching(false);
            return;
          }
          searchCriteria = { phoneNumber: phoneSearch.trim() };
          break;
          
        default:
          toast.error("Invalid search type");
          setIsSearching(false);
          return;
      }

      // In a real app, this would query Firestore
      // Here's how you would query Firestore
      let patientsRef = collection(db, "patients");
      let q;
      
      // Build query based on search criteria
      if (searchType === "name") {
        // For name searches, check if the search string is in either firstName or lastName
        // This is a simple approach; in a real app you might want more sophisticated name searching
        q = query(
          patientsRef,
          or(
            where("firstName", ">=", nameSearch.trim()),
            where("firstName", "<=", nameSearch.trim() + "\uf8ff"),
            where("lastName", ">=", nameSearch.trim()),
            where("lastName", "<=", nameSearch.trim() + "\uf8ff"),
            where("fullName", ">=", nameSearch.trim()),
            where("fullName", "<=", nameSearch.trim() + "\uf8ff")
          )
        );
      } else {
        // For other search types, use the exact criteria
        const field = Object.keys(searchCriteria)[0];
        const value = searchCriteria[field];
        q = query(patientsRef, where(field, "==", value));
      }

      const querySnapshot = await getDocs(q);
      
      // Process the search results
      const results: PatientSearchResult[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        results.push({
          id: doc.id,
          name: data.fullName || `${data.lastName}, ${data.firstName}`,
          mrn: data.mrn,
          dateOfBirth: data.dateOfBirth,
          gender: data.gender || "",
          phoneNumber: data.phoneNumber || ""
        });
      });

      // Update the component state with the results
      setSearchResults(results);
      
      // For demo purposes, add mock data if no results are found
      if (results.length === 0) {
        // Add some mock search results for demonstration
        const mockResults: PatientSearchResult[] = [
          {
            id: "mock-1",
            name: "Doe, John",
            mrn: "1234567",
            dateOfBirth: "1980-06-15",
            gender: "male",
            phoneNumber: "(555) 123-4567"
          },
          {
            id: "mock-2",
            name: "Smith, Jane",
            mrn: "7654321",
            dateOfBirth: "1975-11-22",
            gender: "female",
            phoneNumber: "(555) 987-6543"
          }
        ];
        setSearchResults(mockResults);
        toast.info("Demo mode: Showing mock patient data");
      }
    } catch (error) {
      console.error("Error searching for patients:", error);
      toast.error("An error occurred while searching for patients");
      
      // Show mock data in case of error
      const mockResults: PatientSearchResult[] = [
        {
          id: "mock-1",
          name: "Doe, John",
          mrn: "1234567",
          dateOfBirth: "1980-06-15",
          gender: "male",
          phoneNumber: "(555) 123-4567"
        }
      ];
      setSearchResults(mockResults);
      toast.info("Demo mode: Showing mock patient data");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectPatient = (patient: PatientSearchResult) => {
    onPatientSelect(patient);
    setSearchResults([]);
    // Clear the search fields
    setMrnSearch("");
    setNameSearch("");
    setDobSearch(undefined);
    setPhoneSearch("");
  };

  return (
    <div className="w-full">
      <Tabs defaultValue="mrn" value={searchType} onValueChange={setSearchType} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="mrn">MRN</TabsTrigger>
          <TabsTrigger value="name">Name</TabsTrigger>
          <TabsTrigger value="dob">DOB</TabsTrigger>
          <TabsTrigger value="phone">Phone</TabsTrigger>
        </TabsList>

        {/* MRN Search */}
        <TabsContent value="mrn" className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input 
              value={mrnSearch}
              onChange={(e) => setMrnSearch(e.target.value)}
              placeholder="Enter MRN..."
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={isSearching}>
              {isSearching ? "Searching..." : <Search className="h-4 w-4" />}
            </Button>
          </div>
        </TabsContent>

        {/* Name Search */}
        <TabsContent value="name" className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input 
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
              placeholder="Last name, First name..."
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={isSearching}>
              {isSearching ? "Searching..." : <Search className="h-4 w-4" />}
            </Button>
          </div>
        </TabsContent>

        {/* DOB Search */}
        <TabsContent value="dob" className="space-y-4">
          <div className="flex items-center space-x-2">
            <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="flex-1 justify-start text-left font-normal"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {dobSearch ? (
                    format(dobSearch, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={dobSearch}
                  onSelect={(date) => {
                    setDobSearch(date);
                    setShowDatePicker(false);
                  }}
                  disabled={(date) => date > new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Button onClick={handleSearch} disabled={isSearching}>
              {isSearching ? "Searching..." : <Search className="h-4 w-4" />}
            </Button>
          </div>
        </TabsContent>

        {/* Phone Search */}
        <TabsContent value="phone" className="space-y-4">
          <div className="flex items-center space-x-2">
            <PhoneInput 
              value={phoneSearch}
              onChange={(value) => setPhoneSearch(value)}
              placeholder="(555) 123-4567"
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={isSearching}>
              {isSearching ? "Searching..." : <Search className="h-4 w-4" />}
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="mt-4 space-y-2">
          <h3 className="text-sm font-medium">Search Results</h3>
          {searchResults.map((patient) => (
            <Card key={patient.id} className="hover:bg-muted/50 cursor-pointer" onClick={() => handleSelectPatient(patient)}>
              <CardContent className="p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{patient.name}</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <User className="mr-1 h-3 w-3" />
                      <span className="mr-3">MRN: {patient.mrn}</span>
                      <Calendar className="mr-1 h-3 w-3" />
                      <span className="mr-3">{format(new Date(patient.dateOfBirth), "MM/dd/yyyy")}</span>
                      <Phone className="mr-1 h-3 w-3" />
                      <span>{patient.phoneNumber}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={(e) => {
                    e.stopPropagation();
                    handleSelectPatient(patient);
                  }}>
                    Select
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
