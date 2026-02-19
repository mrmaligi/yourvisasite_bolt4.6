/*
  # Add 'pending' to tracker_outcome enum

  1. Changes
    - Adds 'pending' as a valid value for the tracker_outcome enum type
    - This allows users to submit tracker entries for applications still awaiting a decision

  2. Purpose
    - Supports the "pending application" tracking feature where users can log their application
      and later update it when they receive a decision
*/

ALTER TYPE tracker_outcome ADD VALUE IF NOT EXISTS 'pending';
