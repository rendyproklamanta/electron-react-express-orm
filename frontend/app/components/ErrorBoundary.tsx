import React from 'react';
import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
} from "@/app/components/ui/alert-dialog";

interface Props {
   children: React.ReactNode;
}

interface State {
   error: Error | null;
   open: boolean;
}


class ErrorBoundary extends React.Component<Props, State> {
   constructor(props: Props) {
      super(props);
      this.state = { error: null, open: false };
   }

   static getDerivedStateFromError(error: Error) {
      return { error, open: true };
   }

   componentDidCatch(error: Error, info: React.ErrorInfo) {
      const errorMessage = `React error: ${error.message}\nStack: ${error.stack}\nComponent stack: ${info.componentStack}`;
      window.electronBridge?.logError?.(errorMessage);
      console.error("ErrorBoundary caught a React error:", errorMessage);
   }

   render() {
      if (this.state.error) {
         return (
            <AlertDialog open={this.state.open}>
               <AlertDialogContent>
                  <AlertDialogHeader>
                     <AlertDialogTitle>Something went wrong</AlertDialogTitle>
                     <AlertDialogDescription>
                        {this.state.error.message}
                     </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                     <AlertDialogCancel onClick={() => window.electronBridge?.closeApp?.()}>
                        Close
                     </AlertDialogCancel>
                     <AlertDialogAction onClick={() => location.href = "/"}>
                        Reload App
                     </AlertDialogAction>
                  </AlertDialogFooter>
               </AlertDialogContent>
            </AlertDialog>
         );
      }

      return this.props.children;
   }
}

export default ErrorBoundary;
