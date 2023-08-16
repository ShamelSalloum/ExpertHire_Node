import ErrorHandler from "../utils/errorhander"; 
import catchAsyncErrors from "./catchAsyncErrors"; 
import jwt from "jsonwebtoken"; 
import User from "../models/userModel"; 

 
import { blacklist } from "../controllers/userController"; 
 
export const isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => { 

  const { token } = req.body; 
 
  if (!token) { 
    return next(new ErrorHandler("Please Login to access this resource", 401)); 
  } 

  if(blacklist.includes(token)){ 
    return next(new ErrorHandler("Please Login to access this resource", 401)); 
  } 
  
  try { 
    const decodedData = jwt.verify(token, process.env.JWT_SECRET); 
    req.user = await User.findById(decodedData.id) 
    next(); 
  } catch (err) {
    return next(new ErrorHandler("Invalid or expired token", 401)); 
  } 
}); 

export const authorizeRoles = (...roles) => { 
  return (req, res, next) => { 
    if (!roles.includes(req.user.role)) { 
      return next( 
        new ErrorHandler( 
          `Role: ${req.user.role} is not allowed to access this resource `, 
          403 
        ) 
      ); 
    } 
    next(); 
  }; 
};