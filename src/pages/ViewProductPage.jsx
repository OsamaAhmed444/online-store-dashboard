
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../api/product";
import Spinner from "../components/common/Spinner";
import EmptyState from "../components/common/EmptyState";



